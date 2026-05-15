import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO, format="%(levelname)s [%(name)s] %(message)s")
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, Base
from app.core.limiter import limiter
from app.api.v1.router import api_router
import app.models  # noqa: F401


logger = logging.getLogger(__name__)


async def _seed_admin() -> None:
    if not settings.admin_email or not settings.admin_password:
        return
    from sqlalchemy import select
    from app.core.database import AsyncSessionLocal
    from app.core.security import get_password_hash
    from app.models.admin import Admin
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Admin).where(Admin.email == settings.admin_email))
        if result.scalar_one_or_none():
            return
        db.add(Admin(email=settings.admin_email, password_hash=get_password_hash(settings.admin_password), is_active=True))
        await db.commit()
        logger.info("Admin inicial creado: %s", settings.admin_email)


async def _migrate_categoria_to_varchar() -> None:
    """Convert categoria ENUM → VARCHAR using asyncpg directly (autocommit DDL)."""
    import asyncio
    import asyncpg

    raw_url = settings.database_url.replace("postgresql+asyncpg://", "postgresql://")

    async def _run():
        conn = await asyncpg.connect(raw_url)
        try:
            row = await conn.fetchrow(
                "SELECT data_type FROM information_schema.columns "
                "WHERE table_name='products' AND column_name='categoria'"
            )
            if row and row["data_type"] == "USER-DEFINED":
                await conn.execute(
                    "ALTER TYPE productcategoria ADD VALUE IF NOT EXISTS 'lamparas'"
                )
                await conn.execute(
                    "ALTER TABLE products "
                    "ALTER COLUMN categoria TYPE VARCHAR(50) USING categoria::text"
                )
                await conn.execute("DROP TYPE IF EXISTS productcategoria CASCADE")
                logger.info("Migration OK: categoria ENUM → VARCHAR, lamparas added")
        finally:
            await conn.close()

    try:
        await asyncio.wait_for(_run(), timeout=15.0)
    except Exception as e:
        logger.warning("Migration skipped: %s", e)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await _migrate_categoria_to_varchar()
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created/verified successfully")
        await _seed_admin()
    except Exception as e:
        logger.warning(f"Database init failed (app will still start): {e}")
    yield


app = FastAPI(
    lifespan=lifespan,
    title="EpoxyArt API",
    description="API para el sitio web de EpoxyArt — decoración en resina epóxica",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Slowapi — rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(api_router, prefix="/api")


@app.get("/api/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "service": "EpoxyArt API",
        "version": "1.0.0",
    }
