from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    email: EmailStr
    telefono: Optional[str] = Field(default=None, max_length=30)
    mensaje: str = Field(min_length=10, max_length=1000)


class ContactResponse(BaseModel):
    id: int
    nombre: str
    email: str
    mensaje: str
