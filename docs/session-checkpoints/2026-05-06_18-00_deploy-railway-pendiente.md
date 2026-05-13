# Checkpoint de Sesion: Deploy en Railway — Pendiente Suscripcion

**Fecha**: 2026-05-06 18:00
**Estado general**: EN PROGRESO
**Nivel de contexto**: AMARILLO

---

## Objetivo Original

Desplegar EpoxyArt en producción de la forma más sencilla posible para iniciar marketing. Se saltaron Fases 3 y 5 (IA y Admin Panel) para validar el negocio rápido.

## Contexto del Proyecto

- **Directorio**: `c:\Users\User\Documents\proyectosFercho\epoxi_art`
- **Repo GitHub**: `https://github.com/fercholugo/epoxi_art` (público, ya con código)
- **Stack**: Next.js + FastAPI + PostgreSQL + Redis + Nginx en Docker Compose
- **Email SMTP**: Gmail configurado en `backend/.env` con `fercholugo459@gmail.com`
- **Docker context local**: usar siempre `docker context use default`
- **Rama principal**: `main` (2 commits subidos)

## Progreso

### Completado
- [x] Repo GitHub creado y código subido — `https://github.com/fercholugo/epoxi_art`
- [x] `.gitignore` actualizado — excluye `.claude/`, `backend/.env`, `frontend/.env.local`
- [x] `.gitattributes` creado — manejo de CRLF/LF
- [x] SEO básico — `frontend/app/layout.tsx` con metadataBase, OG completo, Twitter card, JSON-LD LocalBusiness
- [x] `frontend/app/sitemap.ts` — sitemap dinámico App Router
- [x] `frontend/app/robots.ts` — robots.txt con reglas admin/api
- [x] `frontend/app/opengraph-image.tsx` — imagen OG generada dinámicamente (branding dorado)
- [x] `frontend/Dockerfile.prod` — build standalone Next.js optimizado con `node server.js`
- [x] `backend/Dockerfile.prod` — uvicorn sin --reload, usa `${PORT:-8000}`
- [x] `frontend/railway.toml` — apunta a Dockerfile.prod, healthcheck `/`
- [x] `backend/railway.toml` — apunta a Dockerfile.prod, healthcheck `/api/health`
- [x] `docker-compose.prod.yml` — stack completo para VPS futuro con Nginx + Certbot SSL
- [x] Decisión de hosting — Railway plan Pasatiempo ($5/mes)
- [x] Oracle Cloud descartado — demasiados problemas (VCNs acumuladas, gateways con error, límites)

### En Progreso
- [ ] Suscripción a Railway plan Pasatiempo — usuario está en la página de precios, pendiente de confirmar

### Pendiente
- [ ] Crear proyecto en Railway y conectar repo GitHub
- [ ] Agregar PostgreSQL plugin en Railway
- [ ] Agregar Redis plugin en Railway
- [ ] Configurar servicio backend (root: `backend`, variables de entorno)
- [ ] Configurar servicio frontend (root: `frontend`, variables de entorno NEXT_PUBLIC_*)
- [ ] Ejecutar migración Alembic en Railway (`alembic upgrade head`)
- [ ] Verificar sitio vivo en URL de Railway

## Archivos Modificados

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `frontend/app/layout.tsx` | metadataBase, OG completo, Twitter card, JSON-LD LocalBusiness | Commiteado |
| `frontend/app/sitemap.ts` | Sitemap dinámico Next.js App Router | Commiteado |
| `frontend/app/robots.ts` | robots.txt con reglas admin/api excluidos | Commiteado |
| `frontend/app/opengraph-image.tsx` | Imagen OG dinámica con branding dorado/oscuro | Commiteado |
| `frontend/Dockerfile.prod` | Build standalone, ARGs para NEXT_PUBLIC_*, `node server.js` | Commiteado |
| `frontend/railway.toml` | Build con Dockerfile.prod, healthcheck en `/` | Commiteado |
| `backend/Dockerfile.prod` | uvicorn sin --reload, `${PORT:-8000}` para Railway | Commiteado |
| `backend/railway.toml` | Build con Dockerfile.prod, healthcheck en `/api/health` | Commiteado |
| `docker-compose.prod.yml` | Stack completo para VPS con Nginx + Certbot | Commiteado |
| `.gitignore` | Agregado `.claude/` para no subir settings de Claude Code | Commiteado |
| `.gitattributes` | Normalización LF/CRLF | Commiteado |

## Archivos Relevantes (solo lectura)

- `backend/.env` — SMTP ya configurado con Gmail; estas variables van como env vars en Railway
- `backend/app/core/config.py` — Lee `ALLOWED_ORIGINS` como string separado por comas
- `frontend/.env.local.example` — Plantilla de variables NEXT_PUBLIC_* que se configuran en Railway
- `docker-compose.yml` — Referencia del stack de desarrollo local

## Decisiones Tomadas

1. **Railway plan Pasatiempo ($5/mes)**: Plan gratis tiene solo 0.5 GB RAM/servicio — insuficiente para Next.js + FastAPI + PostgreSQL + Redis. Hobby incluye $5 crédito mensual y 48 GB RAM disponibles.
2. **Oracle Cloud descartado definitivamente**: 12+ VCNs de intentos previos con gateways en error, límites de servicio, demasiada fricción para el objetivo de lanzar rápido.
3. **"Open source" = el código, no el hosting**: Todos los componentes (Next.js, FastAPI, PostgreSQL, Redis, Nginx) son open source. El hosting siempre tiene costo.
4. **Sin dominio propio por ahora**: Railway provee subdominio `epoxi-art.up.railway.app`. Se puede conectar dominio propio (~$9/año) después.
5. **NEXT_PUBLIC_* se embeben en build**: El `Dockerfile.prod` acepta estas variables como ARGs de Docker para que queden dentro del bundle de Next.js.

## Problemas / Bloqueos

- **Suscripción Railway pendiente**: Usuario vio la página de precios, necesita seleccionar plan Pasatiempo y pagar.
- **`ALLOWED_ORIGINS` en backend**: Se debe configurar con la URL del frontend de Railway DESPUÉS de que Railway asigne las URLs. Es un paso que se hace al final.
- **`NEXT_PUBLIC_API_URL`**: Necesita la URL del backend de Railway para configurarla en el frontend. También se hace al final.
- **Migración Alembic**: Debe ejecutarse una sola vez después del primer deploy: `railway run --service backend alembic upgrade head`

## Para Reanudar

### Reanudacion automatica:

> El hook SessionStart cargara este checkpoint automaticamente al iniciar
> la proxima sesion de Claude Code en este proyecto. No se necesita ninguna
> instruccion manual.

### Siguiente paso exacto:

El usuario debe estar en railway.app con el plan Pasatiempo activo. Guiarlo en este orden:

1. **Nuevo proyecto** → "Deploy from GitHub repo" → seleccionar `fercholugo/epoxi_art`
2. **Agregar PostgreSQL**: en el proyecto → `+ New` → Database → PostgreSQL
3. **Agregar Redis**: en el proyecto → `+ New` → Database → Redis
4. **Servicio Backend**: `+ New` → GitHub Repo → `epoxi_art` → Settings → Root Directory: `backend` → Variables (ver lista abajo)
5. **Servicio Frontend**: `+ New` → GitHub Repo → `epoxi_art` → Settings → Root Directory: `frontend` → Variables (ver lista abajo)
6. Una vez desplegado, copiar URLs de Railway y actualizar `ALLOWED_ORIGINS` (backend) y `NEXT_PUBLIC_API_URL` (frontend)
7. Ejecutar migración: desde Railway dashboard → backend service → `railway run alembic upgrade head`

**Variables del backend**:
- `DATABASE_URL` → Add Reference → PostgreSQL
- `REDIS_URL` → Add Reference → Redis
- `SMTP_HOST` = smtp.gmail.com
- `SMTP_PORT` = 587
- `SMTP_USER` = fercholugo459@gmail.com
- `SMTP_PASSWORD` = (App Password de Gmail)
- `EMAIL_FROM` = EpoxyArt <fercholugo459@gmail.com>
- `EMAIL_TO` = fercholugo459@gmail.com
- `SECRET_KEY` = (generar: 32 chars random hex)
- `ENVIRONMENT` = production
- `DEBUG` = false
- `ALLOWED_ORIGINS` = (URL frontend Railway — agregar después)

**Variables del frontend**:
- `NEXT_PUBLIC_API_URL` = https://<backend-url>.railway.app/api
- `NEXT_PUBLIC_SITE_URL` = https://<frontend-url>.railway.app
- `NEXT_PUBLIC_WHATSAPP_NUMBER` = (número real del negocio)
- `NEXT_PUBLIC_INSTAGRAM_URL` = https://instagram.com/epoxyart
- `NEXT_PUBLIC_FACEBOOK_URL` = https://facebook.com/epoxyart
