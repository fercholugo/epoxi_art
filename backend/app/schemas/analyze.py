from pydantic import BaseModel
from typing import Literal


class ColorItem(BaseModel):
    hex: str
    nombre: str
    rol: Literal["principal", "secundario", "acento"]


class Paleta(BaseModel):
    nombre: str
    descripcion: str
    colores: list[ColorItem]


class Textura(BaseModel):
    nombre: str
    tecnica: str
    compatibilidad: Literal["alta", "media"]
    razon: str


class AnalysisResult(BaseModel):
    ambiente: str
    estilo_detectado: Literal[
        "moderno", "clásico", "industrial", "minimalista", "rústico", "contemporáneo"
    ]
    iluminacion: Literal["natural", "artificial", "mixta"]
    colores_existentes: list[str]
    paletas_recomendadas: list[Paleta]
    texturas_recomendadas: list[Textura]
    acabado_recomendado: Literal["mate", "semimate", "alto_brillo", "satinado"]
    nivel_complejidad: Literal["básico", "intermedio", "avanzado", "premium"]
    advertencias: list[str]


class AnalyzeResponse(BaseModel):
    success: bool
    analysis: AnalysisResult
    processing_time_ms: int
