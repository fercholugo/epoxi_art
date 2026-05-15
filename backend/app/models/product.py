from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime, Boolean, func
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    nombre = Column(String(120), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio = Column(Numeric(12, 2), nullable=False)
    imagen_url = Column(String(500), nullable=True)
    categoria = Column(String(50), default="otro", nullable=False)
    disponible = Column(Boolean, default=True, nullable=False)
    destacado = Column(Boolean, default=False, nullable=False)
