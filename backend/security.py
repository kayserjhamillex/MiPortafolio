"""Password hashing and opaque session identifiers."""
import hashlib
import hmac
import secrets


def password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=131072, r=8, p=1, maxmem=268435456)
    return f"scrypt:131072:8:1:{salt}:{digest.hex()}"


def password_matches(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, block_size, parallelism, salt, expected = encoded.split(":")
        if (algorithm, rounds, block_size, parallelism) != ("scrypt", "131072", "8", "1"):
            return False
        digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=131072, r=8, p=1, maxmem=268435456)
        return hmac.compare_digest(digest.hex(), expected)
    except (ValueError, TypeError):
        return False


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
