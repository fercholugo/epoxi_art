"""Servicio de envío de emails con SendGrid API.

En desarrollo (SENDGRID_API_KEY vacío) solo loguea — no falla.
"""
import asyncio
import logging
from pathlib import Path

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, ReplyTo

from app.core.config import settings

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).parent.parent.parent / "templates" / "email"


def _load_template(name: str, **kwargs: str) -> str:
    path = TEMPLATES_DIR / name
    if not path.exists():
        logger.warning("Template de email no encontrado: %s", path)
        return "<p>Sin template</p>"
    content = path.read_text(encoding="utf-8")
    for key, value in kwargs.items():
        content = content.replace(f"{{{{{key}}}}}", value)
    return content


async def _send(to: str, subject: str, html: str) -> None:
    if not settings.sendgrid_api_key:
        logger.info("[EMAIL — SendGrid no configurado] Para: %s | Asunto: %s", to, subject)
        return

    message = Mail(
        from_email=(settings.email_from, "EpoxyArt"),
        to_emails=to,
        subject=subject,
        html_content=html,
    )
    if settings.email_reply_to:
        message.reply_to = ReplyTo(settings.email_reply_to)

    try:
        sg = SendGridAPIClient(api_key=settings.sendgrid_api_key)
        await asyncio.to_thread(sg.send, message)
        logger.info("Email enviado a %s — %s", to, subject)
    except Exception as exc:
        logger.error("Error enviando email a %s: %s", to, exc)


async def send_quote_confirmation(
    *,
    client_email: str,
    nombre: str,
    tipo_superficie: str,
    area_m2: float,
    tipo_acabado: str,
    precio_estimado: float,
    ciudad: str,
) -> None:
    html = _load_template(
        "quote_confirmation.html",
        nombre=nombre,
        tipo_superficie=tipo_superficie.replace("_", " ").title(),
        area_m2=str(area_m2),
        tipo_acabado=tipo_acabado.replace("_", " ").title(),
        precio_estimado=f"${precio_estimado:,.2f}",
        ciudad=ciudad,
    )
    await _send(
        to=client_email,
        subject="¡Recibimos tu solicitud! — EpoxyArt",
        html=html,
    )


async def send_quote_notification(
    *,
    nombre: str,
    email: str,
    telefono: str,
    ciudad: str,
    tipo_superficie: str,
    area_m2: float,
    tipo_acabado: str,
    precio_estimado: float,
    mensaje: str | None,
) -> None:
    if not settings.email_to:
        logger.info("[NOTIF] Nueva cotización de %s <%s> — $%.2f", nombre, email, precio_estimado)
        return

    html = _load_template(
        "quote_notification.html",
        nombre=nombre,
        email=email,
        telefono=telefono,
        ciudad=ciudad,
        tipo_superficie=tipo_superficie.replace("_", " ").title(),
        area_m2=str(area_m2),
        tipo_acabado=tipo_acabado.replace("_", " ").title(),
        precio_estimado=f"${precio_estimado:,.2f}",
        mensaje=mensaje or "(sin mensaje)",
    )
    await _send(
        to=settings.email_to,
        subject=f"Nueva cotización — {nombre} — {area_m2}m² — {tipo_superficie}",
        html=html,
    )


async def send_contact_notification(*, nombre: str, email: str, mensaje: str) -> None:
    logger.info("[CONTACTO] %s <%s>: %s", nombre, email, mensaje[:80])
    if not settings.email_to:
        return
    html = f"<p><b>{nombre}</b> ({email}) escribió:</p><p>{mensaje}</p>"
    await _send(
        to=settings.email_to,
        subject=f"Nuevo mensaje de contacto — {nombre}",
        html=html,
    )
