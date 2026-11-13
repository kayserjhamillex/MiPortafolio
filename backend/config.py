from dataclasses import dataclass
import os
from pathlib import Path
from urllib.parse import urlsplit

from sqlalchemy import URL


@dataclass(frozen=True)
class Settings:
    origin: str
    admin_username: str
    admin_password_hash: str
    secret_key: str
    database_url: str | URL
    secure_cookie: bool = True
    frontend_dir: Path = Path(__file__).resolve().parents[1] / "frontend" / "dist"
    session_seconds: int = 28800

    @classmethod
    def from_environment(cls):
        origin = os.environ.get("APP_URL", "").rstrip("/")
        parsed = urlsplit(origin)
        secure = os.environ.get("COOKIE_SECURE", "true").lower() == "true"
        if not parsed.hostname or parsed.scheme not in {"https", "http"} or parsed.path or parsed.query or parsed.fragment:
            raise RuntimeError("APP_URL debe ser el origen del sitio, por ejemplo https://portafolio.tudominio.com")
        if secure and parsed.scheme != "https":
            raise RuntimeError("APP_URL debe usar HTTPS. Para desarrollo HTTP local configura COOKIE_SECURE=false.")
        admin = os.environ.get("ADMIN_USERNAME", "").strip()
        encoded = os.environ.get("ADMIN_PASSWORD_HASH", "")
        secret = os.environ.get("SESSION_SECRET", "")
        if not admin or len(admin) > 100 or not encoded.startswith("scrypt:131072:8:1:"):
            raise RuntimeError("Configura el acceso privado con scripts/configurar.py")
        if len(secret) < 48 or "CAMBIAR" in secret:
            raise RuntimeError("SESSION_SECRET debe contener al menos 48 caracteres aleatorios.")
        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            if not os.environ.get("POSTGRES_PASSWORD"):
                raise RuntimeError("Configura POSTGRES_PASSWORD.")
            database_url = URL.create(
                "postgresql+psycopg",
                username=os.environ.get("POSTGRES_USER", "portfolio"),
                password=os.environ["POSTGRES_PASSWORD"],
                host=os.environ.get("DB_HOST", "db"),
                port=int(os.environ.get("DB_PORT", "5432")),
                database=os.environ.get("POSTGRES_DB", "portfolio"),
            )
        return cls(origin, admin, encoded, secret, database_url, secure)
