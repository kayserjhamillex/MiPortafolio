#!/usr/bin/env python3
"""Rotate only the administrator password hash in the deployment config."""
from getpass import getpass
import os
from pathlib import Path
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.security import password_hash

path = ROOT / ".env"
if not path.is_file():
    raise SystemExit("Primero genera .env con scripts/configurar.py")
password = getpass("Nueva contraseña, al menos 12 caracteres: ")
if not 12 <= len(password) <= 128:
    raise SystemExit("La contraseña debe tener entre 12 y 128 caracteres.")
if password != getpass("Repite la nueva contraseña: "):
    raise SystemExit("Las contraseñas no coinciden.")
lines = path.read_text().splitlines()
if sum(line.startswith("ADMIN_PASSWORD_HASH=") for line in lines) != 1:
    raise SystemExit("No se encontró una única variable ADMIN_PASSWORD_HASH. Revisa .env.")
replacement = "ADMIN_PASSWORD_HASH=" + password_hash(password)
updated = "\n".join(replacement if line.startswith("ADMIN_PASSWORD_HASH=") else line for line in lines) + "\n"
descriptor, temporary = tempfile.mkstemp(prefix=".env-", dir=ROOT)
try:
    os.fchmod(descriptor, 0o600)
    with os.fdopen(descriptor, "w") as file:
        file.write(updated)
    os.replace(temporary, path)
finally:
    if os.path.exists(temporary):
        os.unlink(temporary)
print("Contraseña actualizada. Recrea el contenedor app para aplicar el cambio.")
