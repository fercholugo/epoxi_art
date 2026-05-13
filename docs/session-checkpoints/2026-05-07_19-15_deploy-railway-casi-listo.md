# Checkpoint de Sesion: Deploy Railway — Casi Completo

**Fecha**: 2026-05-07 19:15
**Estado general**: CASI COMPLETO
**Nivel de contexto**: AMARILLO

---

## Objetivo Original

Desplegar EpoxyArt en producción en Railway (plan Hobby $5/mes) para iniciar marketing. Stack: Next.js (frontend) + FastAPI (backend) + PostgreSQL + Redis.

## Contexto del Proyecto

- **Directorio**: `c:\Users\User\Documents\proyectosFercho\epoxi_art`
- **Repo GitHub**: `https://github.com/fercholugo/epoxi_art` (público)
- **Stack**: Next.js 16 + FastAPI + PostgreSQL + Redis
- **Proyecto Railway**: `graceful-vision`
- **WhatsApp negocio**: `573124638167`
- **Email SMTP**: `fercholugo459@gmail.com` / App Password: `ickherkdwqlmbtwi`

## URLs de Railway (confirmadas)

- **Backend**: `https://epoxiart-production.up.railway.app`
- **Frontend**: `https://disciplined-reflection-production-6240.up.railway.app`

## Progreso

### Completado
- [x] Suscripción Railway Hobby ($5/mes) — activa
- [x] Proyecto Railway `graceful-vision` creado
- [x] PostgreSQL — Online en Railway
- [x] Redis — Online en Railway
- [x] Servicio backend (`epoxi_art`) — Online, Root Directory: `backend`
- [x] Variables backend configuradas (11 vars: SMTP, SECRET_KEY, DATABASE_URL, REDIS_URL, etc.)
- [x] Fix `config.py` — validator que convierte `postgresql://` a `postgresql+asyncpg://`
- [x] Fix `useImageAnalysis.ts` — tipo `useRef<HTMLInputElement>` para React 19
- [x] Fix directorio `public/` — creado con `.gitkeep` para Docker build
- [x] Servicio frontend (`disciplined-reflection`) — Online, Root Directory: `frontend`
- [x] Variables frontend configuradas (5 vars NEXT_PUBLIC_*)

### Pendiente
- [ ] Corregir `NEXT_PUBLIC_SITE_URL` en frontend — valor actual es estimado, debe ser la URL real
- [ ] Agregar `ALLOWED_ORIGINS` al backend — necesita URL real del frontend
- [ ] Ejecutar migración Alembic — crear tablas en PostgreSQL de Railway
- [ ] Verificar sitio funcionando end-to-end (formulario de contacto, galería, etc.)

## Archivos Modificados

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `backend/app/core/config.py` | Validator que convierte `postgresql://` → `postgresql+asyncpg://` | Commiteado |
| `frontend/hooks/useImageAnalysis.ts` | `useRef<HTMLInputElement>` sin `\| null` para React 19 | Commiteado |
| `frontend/public/.gitkeep` | Directorio `public/` creado para que Docker build no falle | Commiteado |

## Archivos Relevantes (solo lectura)

- `backend/.env` — Credenciales locales (referencia para variables Railway)
- `backend/app/core/config.py` — Lee variables de entorno; validator de DATABASE_URL ya incluido
- `backend/Dockerfile.prod` — Usa `${PORT:-8000}` para Railway
- `frontend/Dockerfile.prod` — ARGs para NEXT_PUBLIC_*, `node server.js`, puerto 3000
- `backend/railway.toml` — `dockerfilePath = "Dockerfile.prod"`, healthcheck `/api/health`
- `frontend/railway.toml` — `dockerfilePath = "Dockerfile.prod"`, healthcheck `/`

## Decisiones Tomadas

1. **Root Directory sin slash**: Railway requiere `backend` (no `/backend`) para que el build context funcione correctamente
2. **NEXT_PUBLIC_* como ARGs en Dockerfile**: Se embeben en el bundle de Next.js en build time; deben estar en Variables antes del deploy
3. **DATABASE_URL validator**: Railway provee `postgresql://`, el backend necesita `postgresql+asyncpg://`; se convierte automáticamente en config.py

## Problemas / Bloqueos

- **NEXT_PUBLIC_SITE_URL incorrecto**: Se puso `disciplined-reflection-production.up.railway.app` como estimado; la URL real es `disciplined-reflection-production-6240.up.railway.app`. Hay que actualizar y hacer redeploy del frontend.
- **Migración Alembic pendiente**: Sin esto la app no puede guardar datos en la BD. Ejecutar desde Railway CLI o consola.

## Para Reanudar

### Reanudacion automatica:

> El hook SessionStart cargara este checkpoint automaticamente al iniciar
> la proxima sesion de Claude Code en este proyecto. No se necesita ninguna
> instruccion manual.

### Siguiente paso exacto:

**Paso 1 — Corregir NEXT_PUBLIC_SITE_URL** (frontend `disciplined-reflection` → Variables):
- Editar `NEXT_PUBLIC_SITE_URL` → `https://disciplined-reflection-production-6240.up.railway.app`
- Esto dispara un redeploy automático del frontend

**Paso 2 — Agregar ALLOWED_ORIGINS** (backend `epoxi_art` → Variables → New Variable):
- `ALLOWED_ORIGINS` = `https://disciplined-reflection-production-6240.up.railway.app`
- Esto dispara un redeploy del backend

**Paso 3 — Migración Alembic**:
- Opción A (Railway CLI): `railway run --service epoxi_art alembic upgrade head`
- Opción B (Railway Dashboard): `epoxi_art` → Deployments → abrir terminal → `alembic upgrade head`
- Sin esta migración las tablas no existen y el backend dará error 500

**Paso 4 — Verificación final**:
- Abrir `https://disciplined-reflection-production-6240.up.railway.app` en el navegador
- Probar formulario de contacto
- Verificar que el backend responde en `https://epoxiart-production.up.railway.app/api/health`
