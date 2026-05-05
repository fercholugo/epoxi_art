"""Cálculo de precio server-side — espejo de lib/utils.ts del frontend."""

SURFACE_BASE_PRICE: dict[str, float] = {
    "piso_residencial": 80.0,
    "piso_comercial": 65.0,
    "pared_decorativa": 120.0,
    "acabado_especial": 150.0,
    "renovacion": 55.0,
    "exterior_piscina": 70.0,
}

FINISH_MULTIPLIER: dict[str, float] = {
    "mate": 1.0,
    "semimate": 1.15,
    "satinado": 1.25,
    "alto_brillo": 1.4,
}


def calc_price(tipo_superficie: str, area_m2: float, tipo_acabado: str) -> float:
    base = SURFACE_BASE_PRICE.get(tipo_superficie, 80.0)
    multiplier = FINISH_MULTIPLIER.get(tipo_acabado, 1.0)
    return round(base * area_m2 * multiplier, 2)
