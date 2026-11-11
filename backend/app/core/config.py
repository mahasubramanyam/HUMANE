from pydantic import field_validator, model_validator
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

    # Database — individual components (injected by Azure Container Apps via Bicep)
    POSTGRES_USER: str = "humane_user"
    POSTGRES_PASSWORD: str = "humane_secure_password_placeholder"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "humane_db"

    # Database URLs — assembled from components at startup so individual env vars
    # injected by the Container App (POSTGRES_HOST, POSTGRES_PASSWORD, etc.) are
    # always used even when DATABASE_URL / DATABASE_SYNC_URL are not explicitly set.
    DATABASE_URL: str = ""
    DATABASE_SYNC_URL: str = ""

    @model_validator(mode="after")
    def assemble_database_urls(self) -> "Settings":
        """Build DATABASE_URL and DATABASE_SYNC_URL from POSTGRES_* components.

        Any explicitly provided DATABASE_URL / DATABASE_SYNC_URL value takes
        precedence (useful for local development with a custom connection string).
        When the value is empty (the default), the URL is assembled from the
        individual POSTGRES_* environment variables that Azure Container Apps
        injects at runtime.
        """
        user = self.POSTGRES_USER
        password = self.POSTGRES_PASSWORD
        host = self.POSTGRES_HOST
        port = self.POSTGRES_PORT
        db = self.POSTGRES_DB

        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}"
            )
        if not self.DATABASE_SYNC_URL:
            self.DATABASE_SYNC_URL = (
                f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"
            )
        return self

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
