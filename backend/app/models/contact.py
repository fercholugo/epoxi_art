from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.core.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    nombre = Column(String(80), nullable=False)
    email = Column(String(120), nullable=False)
    telefono = Column(String(30), nullable=True)
    mensaje = Column(Text, nullable=False)
    leido = Column(String(1), default="N", nullable=False)
