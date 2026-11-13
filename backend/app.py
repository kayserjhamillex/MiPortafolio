"""VPS application. Public portfolio, public contact intake and private Studio."""
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import hashlib
import hmac
import json
import re
from pathlib import Path
import secrets
import time
from uuid import UUID

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from sqlalchemy import delete, func, insert, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from starlette.middleware.trustedhost import TrustedHostMiddleware
from urllib.parse import urlsplit

from .config import Settings
from .database import limits, make_engine, metadata, records, sessions
from .security import password_matches, token_hash

KINDS = {"drafts", "inquiries", "resources"}
CONTACT_KINDS = {"Sistema a medida", "DevOps y calidad", "IA y automatización", "Docencia o investigación"}


def create_app(settings: Settings | None = None):
    settings = settings or Settings.from_environment()
    engine = make_engine(settings.database_url)
    cookie_name = "__Host-jh_session" if settings.secure_cookie else "jh_session"
    generation = hashlib.sha256((settings.admin_password_hash + settings.secret_key).encode()).hexdigest()

    @asynccontextmanager
    async def lifespan(app):
        metadata.create_all(engine)
        yield
        engine.dispose()

    app = FastAPI(title="Portafolio Jhamil", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
    app.state.engine = engine
    hostname = urlsplit(settings.origin).hostname
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=[hostname, "localhost", "127.0.0.1"])

    @app.middleware("http")
    async def response_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        if request.url.path.startswith(("/api/", "/dashboard/", "/acceso/")):
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.exception_handler(HTTPException)
    async def application_error(request, error):
        return JSONResponse({"error": error.detail}, status_code=error.status_code, headers=error.headers)

    @app.exception_handler(SQLAlchemyError)
    async def database_error(request, error):
        return JSONResponse({"error": "El servicio no está disponible. Inténtalo de nuevo más tarde."}, status_code=503, headers={"Cache-Control": "no-store"})

    def authenticated(request):
        token = request.cookies.get(cookie_name, "")
        if len(token) > 128 or not token:
            return False
        with engine.connect() as connection:
            row = connection.execute(select(sessions).where(sessions.c.token_hash == token_hash(token))).mappings().first()
        return bool(row and row["expires_at"] > int(time.time()) and hmac.compare_digest(row["generation"], generation))

    def require_admin(request):
        if not authenticated(request):
            raise HTTPException(401, "Inicia sesión para acceder al espacio privado.")

    def rate_limit(request, purpose, maximum, window):
        now = int(time.time())
        start = now // window * window
        peer = request.client.host if request.client else "unknown"
        material = f"{purpose}:{peer}:{start}".encode()
        key = hmac.new(settings.secret_key.encode(), material, hashlib.sha256).hexdigest()
        dialect_insert = sqlite_insert if engine.dialect.name == "sqlite" else pg_insert
        statement = dialect_insert(limits).values(key=key, window_start=start, hits=1)
        statement = statement.on_conflict_do_update(index_elements=[limits.c.key], set_={"hits": limits.c.hits + 1}).returning(limits.c.hits)
        with engine.begin() as connection:
            hits = connection.execute(statement).scalar_one()
            connection.execute(delete(limits).where(limits.c.window_start < now - 86400))
        if hits > maximum:
            raise HTTPException(429, "Has realizado varias solicitudes. Inténtalo más tarde.", headers={"Retry-After": str(start + window - now)})

    async def read_json(request):
        if request.headers.get("origin") != settings.origin:
            raise HTTPException(403, "Solicitud no autorizada.")
        if not request.headers.get("content-type", "").startswith("application/json"):
            raise HTTPException(415, "Formato de solicitud no válido.")
        content = bytearray()
        async for chunk in request.stream():
            content.extend(chunk)
            if len(content) > 16384:
                raise HTTPException(413, "El contenido supera el tamaño permitido.")
        try:
            body = json.loads(content)
        except (ValueError, UnicodeDecodeError):
            raise HTTPException(400, "El contenido no tiene un formato válido.")
        if not isinstance(body, dict):
            raise HTTPException(400, "Revisa los datos de la solicitud.")
        return body

    def text_value(body, key, maximum, required=True):
        value = body.get(key, "")
        if not isinstance(value, str):
            raise HTTPException(400, "Revisa los campos de la solicitud.")
        value = value.strip()
        if "\x00" in value or len(value) > maximum or (required and not value):
            raise HTTPException(400, "Completa los campos dentro del tamaño indicado.")
        return value

    @app.get("/health")
    def health():
        try:
            with engine.connect() as connection:
                connection.execute(select(1))
            return {"status": "ok"}
        except Exception:
            return JSONResponse({"status": "unavailable"}, status_code=503)

    @app.get("/api/auth/session")
    def session_status(request: Request):
        active = authenticated(request)
        return {"authenticated": active, "username": settings.admin_username if active else None}

    @app.post("/api/auth/login")
    async def login(request: Request):
        body = await read_json(request)
        rate_limit(request, "login", 10, 900)
        username = text_value(body, "username", 100)
        password = body.get("password", "")
        if not isinstance(password, str) or not 1 <= len(password) <= 128:
            raise HTTPException(400, "Revisa los datos de acceso.")
        valid_password = password_matches(password, settings.admin_password_hash)
        if not hmac.compare_digest(username.encode(), settings.admin_username.encode()) or not valid_password:
            raise HTTPException(401, "Usuario o contraseña incorrectos.")
        token = secrets.token_urlsafe(32)
        with engine.begin() as connection:
            connection.execute(delete(sessions).where(sessions.c.expires_at <= int(time.time())))
            connection.execute(insert(sessions).values(token_hash=token_hash(token), generation=generation, expires_at=int(time.time()) + settings.session_seconds))
        response = JSONResponse({"authenticated": True})
        response.set_cookie(cookie_name, token, max_age=settings.session_seconds, httponly=True, secure=settings.secure_cookie, samesite="strict", path="/")
        return response

    @app.post("/api/auth/logout")
    async def logout(request: Request):
        await read_json(request)
        token = request.cookies.get(cookie_name, "")
        with engine.begin() as connection:
            connection.execute(delete(sessions).where(sessions.c.token_hash == token_hash(token)))
        response = JSONResponse({"authenticated": False})
        response.delete_cookie(cookie_name, path="/", secure=settings.secure_cookie, httponly=True, samesite="strict")
        return response

    @app.get("/api/studio/summary")
    def summary(request: Request):
        require_admin(request)
        with engine.connect() as connection:
            rows = connection.execute(select(records.c.kind, func.count().label("total")).group_by(records.c.kind))
            counts = {"drafts": 0, "inquiries": 0, "resources": 0}
            for row in rows:
                counts[row.kind] = row.total
        return counts

    @app.get("/api/studio/{kind}")
    def list_records(kind: str, request: Request):
        require_admin(request)
        if kind not in KINDS:
            raise HTTPException(404, "Ruta no encontrada.")
        with engine.connect() as connection:
            rows = connection.execute(select(records).where(records.c.kind == kind).order_by(records.c.created_at.desc(), records.c.id.desc()).limit(100)).mappings().all()
        return {"records": [dict(row) for row in rows]}

    @app.post("/api/studio/{kind}", status_code=201)
    async def save_record(kind: str, request: Request):
        if kind not in KINDS:
            raise HTTPException(404, "Ruta no encontrada.")
        if kind != "inquiries":
            require_admin(request)
        body = await read_json(request)
        if kind == "inquiries":
            rate_limit(request, "contact", 20, 600)
        try:
            parsed = UUID(str(body.get("id", "")))
            if parsed.version != 4:
                raise ValueError()
        except ValueError:
            raise HTTPException(400, "El identificador de la solicitud no es válido.")
        values = {
            "id": str(parsed), "kind": kind,
            "title": text_value(body, "title", 90),
            "summary": text_value(body, "summary", 1000),
            "contact_name": None, "contact_email": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        if kind == "inquiries":
            values["contact_name"] = text_value(body, "name", 100)
            values["contact_email"] = text_value(body, "email", 254)
            if values["title"] not in CONTACT_KINDS or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", values["contact_email"]):
                raise HTTPException(400, "Revisa tu nombre, correo y tipo de consulta.")
        dialect_insert = sqlite_insert if engine.dialect.name == "sqlite" else pg_insert
        statement = dialect_insert(records).values(**values).on_conflict_do_nothing(index_elements=[records.c.id])
        with engine.begin() as connection:
            connection.execute(statement)
            saved = connection.execute(select(records).where(records.c.id == values["id"])).mappings().one()
            if any(saved[key] != values[key] for key in ("kind", "title", "summary", "contact_name", "contact_email")):
                raise HTTPException(409, "Esta solicitud corresponde a otro contenido. Recarga la página.")
        return {"record": dict(saved)}

    catalog = json.loads((Path(__file__).parent / "projects.json").read_text(encoding="utf-8"))

    @app.get("/api/projects")
    def project_catalog():
        return {"projects": catalog}

    @app.get("/{path:path}", include_in_schema=False)
    def static_page(path: str, request: Request):
        if path == "dashboard" or path.startswith("dashboard/"):
            if not authenticated(request):
                return RedirectResponse("/acceso/", status_code=303)
        if path.startswith("api/"):
            raise HTTPException(404, "Ruta no encontrada.")
        root = settings.frontend_dir.resolve()
        target = (root / path).resolve()
        if not target.is_relative_to(root):
            raise HTTPException(404, "Página no encontrada.")
        if target.is_file():
            return FileResponse(target)
        routes = {"", "proyectos", "servicios", "docencia", "perfil", "contacto", "arquitectura", "acceso", "dashboard", "dashboard/proyectos", "dashboard/recursos", "dashboard/consultas", "dashboard/index.html"}
        routes.update("proyectos/" + item["slug"] for item in catalog)
        if path.strip("/") not in routes:
            raise HTTPException(404, "Página no encontrada.")
        target = root / "index.html"
        if not target.is_file():
            raise HTTPException(503, "El frontend todavía no ha sido compilado.")
        return FileResponse(target)

    return app
