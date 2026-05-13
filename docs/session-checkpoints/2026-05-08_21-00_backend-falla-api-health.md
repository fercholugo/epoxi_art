# Checkpoint de Sesion: Backend falla en /api/health

**Fecha**: 2026-05-08 21:00
**Estado general**: EN PROGRESO
**Nivel de contexto**: ROJO

---

## Objetivo Original

Completar el deploy de EpoxyArt en Railway: frontend + backend + PostgreSQL + Redis, con tablas creadas y sitio funcionando end-to-end.

## Contexto del Proyecto

- **Directorio**: `c:\Users\User\Documents\proyectosFercho\epoxi_art`
- **Repo GitHub**: `https://github.com/fercholugo/epoxi_art`
- **Proyecto Railway**: `graceful-vision`
- **Stack**: Next.js (frontend) + FastAPI (backend) + PostgreSQL + Redis

## URLs de Railway (confirmadas)

- **Backend**: `https://epoxiart-production.up.railway.app`
- **Frontend**: `https://disciplined-reflection-production-6240.up.railway.app`

## Estado Actual

- **Frontend**: Online y funcionando — el sitio carga correctamente en el navegador
- **Backend**: Railway dice "Deployment successful" pero `/api/health` devuelve "Application failed to respond" en el navegador

## Progreso

### Completado
- [x] PostgreSQL y Redis Online en Railway
- [x] Servicio backend (`epoxi_art`) desplegado — Root Dir: `backend`
- [x] 11 variables de entorno configuradas (SMTP, SECRET_KEY, DATABASE_URL, REDIS_URL, ALLOWED_ORIGINS, etc.)
- [x] Servicio frontend (`disciplined-reflection`) Online — Root Dir: `frontend`
- [x] 5 variables NEXT_PUBLIC_* configuradas en frontend
- [x] Fix `config.py` — validator `postgresql://` → `postgresql+asyncpg://`
- [x] Fix `useImageAnalysis.ts` — useRef React 19
- [x] Fix `public/.gitkeep` — directorio para Docker build
- [x] Fix `railway.toml` — eliminado `startCommand` que sobreescribía el Dockerfile CMD
- [x] `main.py` — agregado lifespan con `create_all` para crear tablas en startup
- [x] ALLOWED_ORIGINS actualizado con URL real del frontend
- [x] NEXT_PUBLIC_SITE_URL corregido con URL real del frontend

### En Progreso
- [ ] Backend respondiendo en `/api/health` — Railway dice OK pero browser dice "Application failed to respond"

### Pendiente
- [ ] Verificar tablas creadas en PostgreSQL
- [ ] Probar formulario de contacto end-to-end
- [ ] Verificar envío de correos

## Archivos Modificados (todos commiteados)

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `backend/app/core/config.py` | Validator postgresql → asyncpg | Commiteado |
| `backend/app/main.py` | Lifespan con `create_all` + import models | Commiteado |
| `backend/Dockerfile.prod` | CMD solo uvicorn (sin alembic) | Commiteado |
| `backend/railway.toml` | Eliminado `startCommand` que bloqueaba Alembic | Commiteado |
| `backend/alembic/env.py` | Reescrito para usar psycopg2 sync (puede revertirse) | Commiteado |
| `backend/requirements.txt` | Agregado `psycopg2-binary==2.9.9` | Commiteado |
| `frontend/hooks/useImageAnalysis.ts` | useRef tipo React 19 | Commiteado |
| `frontend/public/.gitkeep` | Directorio public para Docker | Commiteado |

## Archivos Relevantes (solo lectura)

- `backend/app/main.py` — Tiene el lifespan con `create_all`; si falla el DB en startup, la app no arranca
- `backend/app/core/database.py` — Crea el engine con `settings.database_url` (asyncpg)
- `backend/app/core/config.py` — Validator que convierte URL a asyncpg
- `backend/railway.toml` — Solo tiene build/healthcheck (sin startCommand)

## Decisiones Tomadas

1. **create_all en lugar de Alembic en startup**: Alembic se colgaba 5+ minutos (async y sync) en Railway; `create_all` es más simple y confiable para BD nueva
2. **psycopg2-binary agregado**: Para Alembic sync (env.py reescrito), aunque actualmente no se usa en startup
3. **startCommand eliminado de railway.toml**: Estaba sobreescribiendo el Dockerfile CMD e invocando Alembic

## Problemas / Bloqueos

- **Backend no responde HTTP aunque Railway dice OK**: El deployment activo es "fix: remove startCommand" (exitoso), pero `/api/health` devuelve "Application failed to respond". Posibles causas:
  1. El `create_all` en lifespan falla porque la conexión DB no está lista → app no arranca
  2. La app arranca pero el puerto/routing está mal
  3. El `create_all` tarda mucho y Railway mata la conexión

## Para Reanudar

### Reanudacion automatica:

> El hook SessionStart cargara este checkpoint automaticamente al iniciar
> la proxima sesion de Claude Code en este proyecto. No se necesita ninguna
> instruccion manual.

### Siguiente paso exacto:

1. Verificar git status (`git log --oneline -5`) para confirmar último commit activo
2. En Railway → `epoxi_art` → Deployments → ACTIVE deploy → **Deploy Logs** — ver si hay error Python/SQLAlchemy en los logs después de "Starting Container"
3. Si el error es de conexión DB en `create_all`: considerar hacer el `create_all` opcional (try/except) para que la app arranque aunque la BD falle
4. Si el error es de puerto: revisar Settings → Networking del backend para confirmar que el dominio apunta al puerto correcto

**Código del lifespan actual** (en `backend/app/main.py` líneas ~17-22):
```
@asynccontextmanager
async def lifespan(app):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
```
Si este bloque falla, FastAPI no arranca. Agregar try/except como fix inmediato.
