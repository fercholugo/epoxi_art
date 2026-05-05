import io
import json
import re
import time
from base64 import b64encode

import anthropic
from PIL import Image

from app.core.config import settings
from app.schemas.analyze import AnalysisResult

SYSTEM_PROMPT = """
Eres un experto en diseño de interiores especializado en decoración con resina epóxica.
Analiza la imagen del espacio (piso o pared) y responde ÚNICAMENTE con un JSON válido
con la siguiente estructura, sin texto adicional:

{
  "ambiente": "descripción breve del espacio (máx 15 palabras)",
  "estilo_detectado": "moderno|clásico|industrial|minimalista|rústico|contemporáneo",
  "iluminacion": "natural|artificial|mixta",
  "colores_existentes": ["color1", "color2", "color3"],
  "paletas_recomendadas": [
    {
      "nombre": "nombre artístico de la paleta",
      "descripcion": "por qué armoniza con el espacio",
      "colores": [
        {"hex": "#XXXXXX", "nombre": "nombre del color", "rol": "principal|secundario|acento"}
      ]
    }
  ],
  "texturas_recomendadas": [
    {
      "nombre": "nombre de la textura",
      "tecnica": "descripción técnica breve",
      "compatibilidad": "alta|media",
      "razon": "por qué encaja con este espacio"
    }
  ],
  "acabado_recomendado": "mate|semimate|alto_brillo|satinado",
  "nivel_complejidad": "básico|intermedio|avanzado|premium",
  "advertencias": ["advertencia si hay algo relevante en la superficie"]
}

Proporciona exactamente 3 paletas y 4 texturas. Basa las recomendaciones en:
- Los colores dominantes de la habitación
- El estilo arquitectónico detectado
- La iluminación disponible
- El tipo de superficie (piso o pared)
"""

MAX_IMAGE_PX = 1024


def _preprocess_image(image_bytes: bytes) -> tuple[str, str]:
    """Resize image to max MAX_IMAGE_PX, convert to JPEG, return (base64, media_type)."""
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    w, h = img.size
    if max(w, h) > MAX_IMAGE_PX:
        scale = MAX_IMAGE_PX / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return b64encode(buf.getvalue()).decode(), "image/jpeg"


def _extract_json(text: str) -> dict:
    """Extract JSON object from text, tolerating markdown code fences."""
    text = text.strip()
    # Strip markdown fences
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


async def analyze_image(image_bytes: bytes, surface_type: str) -> tuple[AnalysisResult, int]:
    """Call Anthropic vision API and return (AnalysisResult, processing_time_ms)."""
    start = time.monotonic()

    b64_data, media_type = _preprocess_image(image_bytes)

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": b64_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": f"Analiza esta imagen de {surface_type} y proporciona tus recomendaciones de resina epóxica.",
                    },
                ],
            }
        ],
    )

    elapsed_ms = int((time.monotonic() - start) * 1000)
    raw_text = message.content[0].text
    data = _extract_json(raw_text)
    result = AnalysisResult(**data)
    return result, elapsed_ms
