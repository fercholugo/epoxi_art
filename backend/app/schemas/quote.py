from typing import Optional, Literal
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


SurfaceType = Literal[
    "piso_residencial",
    "piso_comercial",
    "pared_decorativa",
    "acabado_especial",
    "renovacion",
    "exterior_piscina",
]

FinishType = Literal["mate", "semimate", "satinado", "alto_brillo"]


class QuoteCreate(BaseModel):
    """Schema que acepta el JSON camelCase que manda el frontend."""

    model_config = ConfigDict(populate_by_name=True)

    nombre: str = Field(min_length=2, max_length=80)
    email: EmailStr
    telefono: str = Field(min_length=7, max_length=30)
    ciudad: str = Field(min_length=2, max_length=80)

    # camelCase del frontend — FastAPI los acepta con el nombre exacto del campo
    tipoSuperficie: SurfaceType
    areaM2: float = Field(ge=5, le=500)
    tipoAcabado: FinishType
    mensaje: Optional[str] = Field(default=None, max_length=500)

    # El frontend puede enviar el precio que calculó; el servidor calcula el propio
    precioEstimado: Optional[float] = None


class QuoteResponse(BaseModel):
    id: int
    nombre: str
    email: str
    ciudad: str
    tipoSuperficie: str
    areaM2: float
    tipoAcabado: str
    precioEstimado: Optional[Decimal]
    estado: str
    createdAt: datetime
    mensaje: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
