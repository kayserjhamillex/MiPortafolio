#!/usr/bin/env python3
"""Generate deployment credentials on the administrator's machine."""
import argparse
import os
from pathlib import Path
import re
import secrets
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.security import password_hash

parser = argparse.ArgumentParser(description="Configurar el dominio y el acceso privado del portafolio.")
parser.add_argument("--domain", required=True, help="Dominio sin https:// ni rutas.")
parser.add_argument("--admin", default="jhamil", help="Usuario del dashboard.")
args = parser.parse_args()
domain = args.domain.strip().lower()
if not re.fullmatch(r"(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}", domain):
    parser.error("Escribe un dominio válido, por ejemplo portafolio.tudominio.com")
if not re.fullmatch(r"[a-zA-Z0-9_.-]{3,100}", args.admin):
    parser.error("El usuario debe tener entre 3 y 100 letras, números, puntos, guiones o guiones bajos.")
path = ROOT / ".env"
if path.exists():
    parser.error("Ya existe .env. Revisa ese archivo para conservar tus credenciales y conexión de base de datos.")
password = secrets.token_urlsafe(24)
values = {
    "DOMAIN": domain, "APP_URL": "https://" + domain, "ADMIN_USERNAME": args.admin,
    "ADMIN_PASSWORD_HASH": password_hash(password), "SESSION_SECRET": secrets.token_hex(32),
    "POSTGRES_DB": "portfolio", "POSTGRES_USER": "portfolio", "POSTGRES_PASSWORD": secrets.token_hex(24),
}
descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(descriptor, "w") as file:
    for key, value in values.items():
        file.write(key + "=" + value + "\n")
print("Configuración creada para https://" + domain)
print("Usuario del dashboard: " + args.admin)
print("Contraseña del dashboard: " + password)
print("Guarda esta contraseña en tu gestor de contraseñas. En .env se conserva únicamente su hash.")
