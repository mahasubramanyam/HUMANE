import hashlib
import secrets

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def generate_session_token() -> str:
    """Generate a high-entropy URL-safe session token (32 bytes / 256 bits)."""
    return secrets.token_urlsafe(32)


def hash_session_token(token: str) -> str:
    """Compute SHA-256 hash of a session token for secure database lookup."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
