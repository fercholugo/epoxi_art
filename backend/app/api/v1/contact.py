import logging
from fastapi import APIRouter, Depends, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.limiter import limiter
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.email import send_contact_notification

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=ContactResponse, status_code=201)
@limiter.limit("3/hour")
async def create_contact(
    body: ContactCreate,
    background_tasks: BackgroundTasks,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    contact = Contact(
        nombre=body.nombre,
        email=body.email,
        telefono=body.telefono,
        mensaje=body.mensaje,
    )
    db.add(contact)
    await db.commit()
    await db.refresh(contact)

    logger.info("Nuevo mensaje de contacto #%d — %s <%s>", contact.id, contact.nombre, contact.email)

    background_tasks.add_task(
        send_contact_notification,
        nombre=contact.nombre,
        email=contact.email,
        mensaje=contact.mensaje,
    )

    return ContactResponse(
        id=contact.id,
        nombre=contact.nombre,
        email=contact.email,
        mensaje=contact.mensaje,
    )
