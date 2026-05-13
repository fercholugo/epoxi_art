import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

logger = logging.getLogger(__name__)
router = APIRouter()


# ─── Público ─────────────────────────────────────────────────────────────────

@router.get("", response_model=List[ProductResponse])
async def list_products(
    categoria: Optional[str] = None,
    destacado: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Product)
        .where(Product.disponible == True)
        .order_by(desc(Product.destacado), Product.nombre)
    )
    if categoria:
        query = query.where(Product.categoria == categoria)
    if destacado is not None:
        query = query.where(Product.destacado == destacado)
    result = await db.execute(query)
    return [_to_response(p) for p in result.scalars().all()]


@router.get("/admin/all", response_model=List[ProductResponse])
async def list_all_products(
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Product).order_by(desc(Product.destacado), Product.nombre)
    )
    return [_to_response(p) for p in result.scalars().all()]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.disponible == True)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _to_response(product)


# ─── Admin ────────────────────────────────────────────────────────────────────

@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    body: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    product = Product(**body.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    logger.info("Producto creado: #%d — %s", product.id, product.nombre)
    return _to_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    body: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return _to_response(product)


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    await db.delete(product)
    await db.commit()


# ─── Helper ───────────────────────────────────────────────────────────────────

def _to_response(p: Product) -> ProductResponse:
    return ProductResponse(
        id=p.id,
        nombre=p.nombre,
        descripcion=p.descripcion,
        precio=p.precio,
        imagen_url=p.imagen_url,
        categoria=p.categoria.value if hasattr(p.categoria, "value") else p.categoria,
        disponible=p.disponible,
        destacado=p.destacado,
        createdAt=p.created_at,
    )
