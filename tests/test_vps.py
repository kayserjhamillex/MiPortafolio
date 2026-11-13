import json
from pathlib import Path
import time
from uuid import uuid4

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import update

from backend.app import create_app
from backend.config import Settings
from backend.database import sessions
from backend.security import password_hash

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://portfolio.example"
PASSWORD = "Clave-de-validacion-local-2026"


@pytest.fixture
def client(tmp_path):
    config = Settings(
        origin=ORIGIN, admin_username="jhamil", admin_password_hash=password_hash(PASSWORD),
        secret_key="a" * 64, database_url="sqlite:///" + str(tmp_path / "portfolio.sqlite"),
        frontend_dir=ROOT / "frontend" / "dist",
    )
    app = create_app(config)
    with TestClient(app, base_url=ORIGIN, follow_redirects=False) as browser:
        yield browser


def post(client, path, body):
    return client.post(path, json=body, headers={"Origin": ORIGIN})


def login(client):
    return post(client, "/api/auth/login", {"username": "jhamil", "password": PASSWORD})


def record(**values):
    return {"id": str(uuid4()), "title": "Caso local", "summary": "Contenido de verificación", **values}


def test_public_portfolio_and_admin_boundary(client):
    assert client.get("/").status_code == 200
    catalog = client.get("/api/projects").json()["projects"]
    assert len(catalog) == 13
    for project in catalog:
        page = client.get("/proyectos/" + project["slug"] + "/")
        assert page.status_code == 200 and 'id="root"' in page.text
    assert client.get("/assets/no-existe.js").status_code == 404
    assert client.get("/proyectos/").status_code == 200
    assert client.get("/assets/jhamil-huaman.webp").headers["content-type"].startswith("image/webp")
    assert client.get("/dashboard/").status_code == 303
    assert client.get("/dashboard/index.html").status_code == 303
    assert client.get("/acceso/").status_code == 200
    response = client.get("/api/studio/inquiries", headers={"oai-authenticated-user-id": "forged"})
    assert response.status_code == 401
    assert post(client, "/api/studio/drafts", record()).status_code == 401
    assert client.get("/proyectos/optica-saas-inteligencia-artificial/").status_code == 404
    assert client.get("/.env").status_code == 404


def test_login_cookie_logout_and_expiration(client):
    assert post(client, "/api/auth/login", {"username": "jhamil", "password": "incorrecta"}).status_code == 401
    response = login(client)
    assert response.status_code == 200
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie and "secure" in cookie and "samesite=strict" in cookie
    assert client.get("/dashboard/").status_code == 200
    assert client.get("/api/auth/session").json()["authenticated"]
    saved_token = client.cookies.get("__Host-jh_session")
    assert post(client, "/api/auth/logout", {}).status_code == 200
    assert client.get("/api/studio/summary").status_code == 401
    client.cookies.set("__Host-jh_session", saved_token, domain="portfolio.example", path="/")
    assert client.get("/api/studio/summary").status_code == 401
    client.cookies.clear()
    assert login(client).status_code == 200
    with client.app.state.engine.begin() as connection:
        connection.execute(update(sessions).values(expires_at=int(time.time()) - 1))
    assert client.get("/dashboard/").status_code == 303


def test_contact_is_public_and_lists_are_private(client):
    body = record(title="DevOps y calidad", name="QA local", email="qa@example.test")
    assert post(client, "/api/studio/inquiries", body).status_code == 201
    assert post(client, "/api/studio/inquiries", body).status_code == 201
    assert client.get("/api/studio/summary").status_code == 401
    assert login(client).status_code == 200
    assert client.get("/api/studio/summary").json() == {"drafts": 0, "inquiries": 1, "resources": 0}
    saved = client.get("/api/studio/inquiries").json()["records"][0]
    assert saved["contact_email"] == "qa@example.test"
    assert post(client, "/api/studio/inquiries", {**body, "summary": "Otro mensaje"}).status_code == 409


def test_editorial_records_and_counts(client):
    assert login(client).status_code == 200
    body = record()
    assert post(client, "/api/studio/drafts", body).status_code == 201
    assert post(client, "/api/studio/drafts", body).status_code == 201
    assert post(client, "/api/studio/resources", record()).status_code == 201
    assert client.get("/api/studio/summary").json() == {"drafts": 1, "inquiries": 0, "resources": 1}
    assert len(client.get("/api/studio/drafts").json()["records"]) == 1


def test_validation_origin_and_rate_limits(client):
    body = record(title="DevOps y calidad", name="QA local", email="qa@example.test")
    assert client.post("/api/studio/inquiries", json=body).status_code == 403
    assert client.post("/api/studio/inquiries", json=body, headers={"Origin": "https://otro.example"}).status_code == 403
    assert post(client, "/api/studio/inquiries", {**body, "email": "invalido"}).status_code == 400
    assert post(client, "/api/studio/inquiries", {**body, "id": "x"}).status_code == 400
    assert post(client, "/api/studio/inquiries", {**body, "summary": "\x00"}).status_code == 400
    for _ in range(10):
        assert post(client, "/api/auth/login", {"username": "x", "password": "incorrecta"}).status_code == 401
    response = post(client, "/api/auth/login", {"username": "x", "password": "incorrecta"})
    assert response.status_code == 429 and int(response.headers["retry-after"]) > 0


def test_catalog_and_clean_build():
    projects = json.loads((ROOT / "frontend/src/projects.json").read_text())
    assert len(projects) == 13
    assert all(item["slug"] != "optica-saas-inteligencia-artificial" for item in projects)
    assert len(list((ROOT / "frontend/dist").rglob("index.html"))) == 1
    assert not (ROOT / "frontend/dist/server").exists()
    assert list((ROOT / "frontend/dist/assets").glob("*.js"))
    assert json.loads((ROOT / "backend/projects.json").read_text()) == projects
