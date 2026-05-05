import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.security import verify_password, create_access_token
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/hour")
async def login(
    body: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Admin).where(Admin.email == body.email))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(body.password, admin.password_hash):
        logger.warning("Intento de login fallido para: %s", body.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )

    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cuenta desactivada")

    token = create_access_token({"sub": str(admin.id)})
    logger.info("Login exitoso: %s", admin.email)

    return TokenResponse(access_token=token, admin_email=admin.email)
