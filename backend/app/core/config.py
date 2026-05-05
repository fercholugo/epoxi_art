from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Base de datos
    database_url: str = "postgresql+asyncpg://epoxyart:epoxyart_dev_pass@postgres:5432/epoxyart_db"
    redis_url: str = "redis://redis:6379/0"

    # IA
    anthropic_api_key: str = ""

    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "EpoxyArt <noreply@epoxyart.co>"
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
