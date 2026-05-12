from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Base de datos
    database_url: str = "postgresql+asyncpg://epoxyart:epoxyart_dev_pass@postgres:5432/epoxyart_db"

    @field_validator("database_url", mode="before")
    @classmethod
    def fix_database_url(cls, v: str) -> str:
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    redis_url: str = "redis://redis:6379/0"

    # IA
    anthropic_api_key: str = ""

    # Email
    sendgrid_api_key: str = ""
    email_from: str = ""
    email_reply_to: str = ""
    email_to: str = ""

    # Seguridad
    secret_key: str = "dev-secret-key-change-in-production"
    allowed_origins: str = "http://localhost:3000,http://localhost"

    # App
    environment: str = "development"
    debug: bool = True

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]


settings = Settings()
