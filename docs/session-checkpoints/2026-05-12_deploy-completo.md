# Checkpoint de Sesion: Deploy EpoxyArt COMPLETO

**Fecha**: 2026-05-12 18:00
**Estado general**: COMPLETO
**Nivel de contexto**: VERDE

---

## Objetivo Original

Completar el deploy de EpoxyArt en Railway con flujo end-to-end funcional: formulario de cotización → backend → PostgreSQL → emails de confirmación y notificación.

## Contexto del Proyecto

- **Directorio**: `c:\Users\User\Documents\proyectosFercho\epoxi_art`
- **Repo GitHub**: `https://github.com/fercholugo/epoxi_art`
- **Proyecto Railway**: `graceful-vision`
- **Stack**: Next.js (frontend) + FastAPI (backend) + PostgreSQL + Redis

## URLs de Railway (producción)

- **Backend**: `https://epoxiart-production.up.railway.app`
- **Frontend**: `https://disciplined-reflection-production-6240.up.railway.app`

## Progreso

### Completado
- [x] Frontend online — Next.js desplegado, carga correctamente
- [x] Backend online — FastAPI en puerto 8000, 1 worker uvicorn
- [x] PostgreSQL online — tablas creadas via `create_all` en lifespan
- [x] Redis online
- [x] Formulario de cotización — envío funciona, devuelve 201, guarda en BD
- [x] Email confirmación al cliente — llega con diseño HTML completo via SendGrid
- [x] Email notificación al negocio — llega con todos los datos del cliente via SendGrid
- [x] CORS configurado — frontend puede llamar al backend
- [x] Variables de entorno configuradas en Railway (backend y frontend)

### Pendiente (mejoras futuras)
- [ ] Verificar formulario de contacto si existe endpoint separado
- [ ] Dominio propio para email FROM (actualmente usa sendgrid.net como relay)
- [ ] Dominio custom para las URLs de Railway (opcional)

## Archivos Modificados (todos commiteados)

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `backend/app/main.py` | try/except en lifespan create_all | Commiteado |
| `backend/Dockerfile.prod` | `--workers 1` para evitar conflictos async | Commiteado |
| `backend/app/core/config.py` | Variables SendGrid: `sendgrid_api_key`, `email_from`, `email_reply_to`, `email_to` | Commiteado |
| `backend/app/services/email.py` | Reescrito: aiosmtplib → SendGrid SDK con asyncio.to_thread | Commiteado |
| `backend/requirements.txt` | `sendgrid==6.11.0` (reemplazó aiosmtplib y resend) | Commiteado |

## Variables en Railway Backend (epoxi_art)

- `PORT=8000`
- `SENDGRID_API_KEY=SG.hJeS1i...`
- `EMAIL_FROM=fercholugo459@gmail.com`
- `EMAIL_REPLY_TO=fercholugo459@gmail.com`
- `EMAIL_TO=fercholugo459@gmail.com`
- `ALLOWED_ORIGINS=https://disciplined-reflection-production-6240.up.railway.app`
- `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `ENVIRONMENT`, `DEBUG`

## Variables en Railway Frontend (disciplined-reflection)

- `NEXT_PUBLIC_API_URL=https://epoxiart-production.up.railway.app`
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`

## Decisiones Tomadas

1. **SendGrid Single Sender Verification**: Railway bloquea SMTP (587 y 465). SendGrid con email verificado individualmente permite enviar a cualquier destinatario sin dominio propio.
2. **asyncio.to_thread para SendGrid**: SDK es síncrono; se wrappea para no bloquear el event loop de FastAPI.
3. **1 worker uvicorn**: Evita conflictos de event loop con async SQLAlchemy en múltiples workers.
4. **Puerto 8000 explícito**: Railway tenía configurado Port 3000 en Networking — causa original del 502. Corregido en Settings → Networking y con variable PORT=8000.

## Problemas Resueltos

- **502 Bad Gateway**: Puerto 3000 en Railway Networking vs app en 8000 → corregido
- **SMTP bloqueado**: Railway bloquea 587 y 465 → migrado a SendGrid HTTP API
- **Resend free tier**: Solo enviaba al email del owner → descartado, reemplazado por SendGrid
- **CORS error**: ALLOWED_ORIGINS no incluía URL del frontend → corregido en variables Railway

## Para Reanudar

### Reanudacion automatica:

> El hook SessionStart cargara este checkpoint automaticamente al iniciar
> la proxima sesion de Claude Code en este proyecto. No se necesita ninguna
> instruccion manual.

### Siguiente paso exacto:

El deploy está COMPLETO y funcionando. En una nueva sesión, posibles tareas a continuar:

1. **Verificar formulario de contacto**: revisar si existe endpoint `/api/v1/contact` y probarlo desde el frontend
2. **Dominio custom**: configurar dominio propio en Railway para URLs más limpias
3. **Verificar dominio en SendGrid**: si se adquiere dominio, verificarlo en SendGrid para que el FROM sea `noreply@epoxyart.co` en lugar de `fercholugo459@gmail.com via sendgrid.net`
4. **Monitoreo**: revisar Railway Metrics periódicamente para asegurar estabilidad
