import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, BackgroundTasks, Request, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from pydantic import BaseModel

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.security import get_current_admin
from app.models.quote import Quote, QuoteEstado
from app.schemas.quote import QuoteCreate, QuoteResponse
from app.services.price_calc import calc_price
from app.services.email import send_quote_confirmation, send_quote_notification

logger = logging.getLogger(__name__)

router = APIRouter()


# ─── Público ────────────────────────────────────────────────────────────────

@router.post("", response_model=QuoteResponse, status_code=201)
@limiter.limit("5/hour")
async def create_quote(
    body: QuoteCreate,
    background_tasks: BackgroundTasks,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    precio = calc_price(body.tipoSuperficie, body.areaM2, body.tipoAcabado)

    quote = Quote(
        nombre=body.nombre,
        email=body.email,
        telefono=body.telefono,
        ciudad=body.ciudad,
        tipo_superficie=body.tipoSuperficie,
        area_m2=body.areaM2,
        tipo_acabado=body.tipoAcabado,
        precio_estimado=precio,
        mensaje=body.mensaje,
    )
    db.add(quote)
    await db.commit()
    await db.refresh(quote)

    logger.info("Nueva cotización #%d — %s <%s> — $%.2f", quote.id, quote.nombre, quote.email, precio)

    background_tasks.add_task(
        send_quote_confirmation,
        client_email=quote.email,
        nombre=quote.nombre,
        tipo_superficie=quote.tipo_superficie,
        area_m2=quote.area_m2,
        tipo_acabado=quote.tipo_acabado,
        precio_estimado=float(quote.precio_estimado),
        ciudad=quote.ciudad,
    )
    background_tasks.add_task(
        send_quote_notification,
        nombre=quote.nombre,
        email=quote.email,
        telefono=quote.telefono,
        ciudad=quote.ciudad,
        tipo_superficie=quote.tipo_superficie,
        area_m2=quote.area_m2,
        tipo_acabado=quote.tipo_acabado,
        precio_estimado=float(quote.precio_estimado),
        mensaje=quote.mensaje,
    )

    return _to_response(quote)


# ─── Protegidos (solo admin) ─────────────────────────────────────────────────

class QuoteListItem(BaseModel):
    id: int
    nombre: str
    email: str
    ciudad: str
    tipoSuperficie: str
    areaM2: float
    precioEstimado: Optional[float]
    estado: str
    createdAt: str


class QuoteListResponse(BaseModel):
    items: List[QuoteListItem]
    total: int


class DashboardStats(BaseModel):
    total: int
    pendientes: int
    esta_semana: int
    ingresos_estimados: float


class PatchEstado(BaseModel):
    estado: QuoteEstado
    notas: Optional[str] = None


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    from datetime import datetime, timedelta
    from sqlalchemy import cast, Date

    total_r = await db.execute(select(func.count()).select_from(Quote))
    total = total_r.scalar()

    pendientes_r = await db.execute(
        select(func.count()).select_from(Quote).where(Quote.estado == QuoteEstado.pendiente)
    )
    pendientes = pendientes_r.scalar()

    semana_inicio = datetime.utcnow() - timedelta(days=7)
    semana_r = await db.execute(
        select(func.count()).select_from(Quote).where(Quote.created_at >= semana_inicio)
    )
    esta_semana = semana_r.scalar()

    ingresos_r = await db.execute(select(func.sum(Quote.precio_estimado)).select_from(Quote))
    ingresos = ingresos_r.scalar() or 0

    return DashboardStats(
        total=total,
        pendientes=pendientes,
        esta_semana=esta_semana,
        ingresos_estimados=float(ingresos),
    )


@router.get("", response_model=QuoteListResponse)
async def list_quotes(
    estado: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    query = select(Quote).order_by(desc(Quote.created_at))

    if estado:
        query = query.where(Quote.estado == estado)
    if search:
        term = f"%{search}%"
        query = query.where(
            (Quote.nombre.ilike(term)) | (Quote.email.ilike(term))
        )

    count_r = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_r.scalar()

    offset = (page - 1) * page_size
    quotes_r = await db.execute(query.offset(offset).limit(page_size))
    quotes = quotes_r.scalars().all()

    return QuoteListResponse(
        items=[
            QuoteListItem(
                id=q.id,
                nombre=q.nombre,
                email=q.email,
                ciudad=q.ciudad,
                tipoSuperficie=q.tipo_superficie,
                areaM2=q.area_m2,
                precioEstimado=float(q.precio_estimado) if q.precio_estimado else None,
                estado=q.estado.value,
                createdAt=q.created_at.isoformat(),
            )
            for q in quotes
        ],
        total=total,
    )


@router.get("/{quote_id}", response_model=QuoteResponse)
async def get_quote(
    quote_id: int,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(Quote).where(Quote.id == quote_id))
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    return _to_response(quote)


@router.patch("/{quote_id}", response_model=QuoteResponse)
async def update_quote(
    quote_id: int,
    body: PatchEstado,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(Quote).where(Quote.id == quote_id))
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")

    quote.estado = body.estado
    if body.notas is not None:
        quote.analysis_result = body.notas  # reutilizamos el campo para notas internas
    await db.commit()
    await db.refresh(quote)
    logger.info("Cotización #%d actualizada → %s", quote.id, body.estado.value)
    return _to_response(quote)


# ─── Helper ──────────────────────────────────────────────────────────────────

def _to_response(quote: Quote) -> QuoteResponse:
    return QuoteResponse(
        id=quote.id,
        nombre=quote.nombre,
        email=quote.email,
        ciudad=quote.ciudad,
        tipoSuperficie=quote.tipo_superficie,
        areaM2=quote.area_m2,
        tipoAcabado=quote.tipo_acabado,
        precioEstimado=quote.precio_estimado,
        estado=quote.estado.value,
        createdAt=quote.created_at,
        mensaje=quote.mensaje,
    )
