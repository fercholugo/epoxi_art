import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Numeric, Text,
    DateTime, Boolean, Enum as SAEnum, func,
)
from app.core.database import Base


class QuoteEstado(str, enum.Enum):
    pendiente = "pendiente"
    contactado = "contactado"
    en_proceso = "en_proceso"
    completado = "completado"
    cancelado = "cancelado"


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Datos del cliente
    nombre = Column(String(80), nullable=False)
    email = Column(String(120), nullable=False, index=True)
    telefono = Column(String(30), nullable=False)
    ciudad = Column(String(80), nullable=False)

    # Detalles del proyecto
    tipo_superficie = Column(String(30), nullable=False)
    area_m2 = Column(Float, nullable=False)
    tipo_acabado = Column(String(30), nullable=False)
    precio_estimado = Column(Numeric(12, 2), nullable=True)
    mensaje = Column(Text, nullable=True)

    # Estado y resultado IA
    estado = Column(SAEnum(QuoteEstado), default=QuoteEstado.pendiente, nullable=False)
    imagen_analizada = Column(Boolean, default=False, nullable=False)
    analysis_result = Column(Text, nullable=True)  # JSON serializado
