from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "HUMANE"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # API
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list[str] | str = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json

                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000"]

    # Database
    POSTGRES_USER: str = "humane_user"
    POSTGRES_PASSWORD: str = "humane_secure_password_placeholder"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "humane_db"

    # Database URLs (Async for FastAPI runtime, Sync for Alembic)
    DATABASE_URL: str = "postgresql+asyncpg://humane_user:humane_secure_password_placeholder@localhost:5432/humane_db"
    DATABASE_SYNC_URL: str = "postgresql+psycopg2://humane_user:humane_secure_password_placeholder@localhost:5432/humane_db"

    # Security & Session Management
    SESSION_SECRET_KEY: str = "dev_secret_key_change_me_to_minimum_32_chars_in_production"
    SESSION_COOKIE_NAME: str = "humane_session"
    SESSION_EXPIRE_SECONDS: int = 86400  # 24 hours
    SESSION_SECURE_COOKIE: bool = False  # Set to True in production (HTTPS)
    SESSION_SAME_SITE: str = "lax"
    CSRF_SECRET_KEY: str = "dev_csrf_secret_key_change_in_production_32_chars"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Storage Configuration
    STORAGE_PROVIDER: str = "local"
    STORAGE_LOCAL_ROOT: str = "./local_storage"
    AZURE_STORAGE_ACCOUNT_NAME: str = "placeholder_account_name"
    AZURE_STORAGE_ACCOUNT_KEY: str = "placeholder_account_key"
    AZURE_STORAGE_CONTAINER_NAME: str = "humane-sensitive-documents"


settings = Settings()
