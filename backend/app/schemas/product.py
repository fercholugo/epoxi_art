from typing import Optional
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ProductCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=1000)
    precio: Decimal = Field(gt=0)
    imagen_url: Optional[str] = Field(default=None, max_length=500)
    categoria: str = "otro"
    disponible: bool = True
    destacado: bool = False


class ProductUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=120)
    descripcion: Optional[str] = None
    precio: Optional[Decimal] = None
    imagen_url: Optional[str] = None
    categoria: Optional[str] = None
    disponible: Optional[bool] = None
    destacado: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio: Decimal
    imagen_url: Optional[str]
    categoria: str
    disponible: bool
    destacado: bool
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)
