import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO, format="%(levelname)s [%(name)s] %(message)s")
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import engine, Base
from app.core.limiter import limiter
from app.api.v1.router import api_router
import app.models  # noqa: F401


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created/verified successfully")
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
