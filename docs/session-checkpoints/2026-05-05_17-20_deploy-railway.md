# Checkpoint de Sesion: Deploy GitHub + Railway

**Fecha**: 2026-05-05 17:20
**Estado general**: EN PROGRESO
**Nivel de contexto**: VERDE

---

## Objetivo Original

Saltar Fase 5 (Panel Admin) y pasar directo a producción con la estrategia más sencilla posible para validar el negocio y empezar marketing cuanto antes.

## Contexto del Proyecto

- **Directorio**: `c:\Users\User\Documents\proyectosFercho\epoxi_art`
- **Stack**: Next.js + FastAPI + PostgreSQL + Redis + Nginx en Docker Compose
- **Fases completadas**: 1 (infra), 2 (landing), 4 (backend cotizaciones con emails)
- **Fase 3 pospuesta**: Análisis IA — decisión del usuario
- **Fase 5 omitida**: Panel Admin — decisión del usuario (validar negocio primero)
- **Docker context**: Usar siempre `docker context use default`
- **Email SMTP**: Gmail configurado en `backend/.env` con `fercholugo459@gmail.com`
- **Todos los servicios están UP** y el formulario funciona de punta a punta

## Progreso

### Completado
- [x] Fases 1, 2, 4 — Stack local funcionando, landing completa, cotizaciones guardan en DB y envían emails
- [x] Decisión de estrategia de deploy — GitHub + Railway (más simple, sin gestionar servidor)
- [x] Decisión de omitir Fase 5 — Panel Admin se implementa después si el negocio lo requiere

### En Progreso
- [ ] Ninguna tarea iniciada aún — esperando OK del usuario para arrancar

### Pendiente
- [ ] Crear repositorio en GitHub y subir el código
- [ ] SEO básico en el frontend (metadata, Open Graph, sitemap.xml, robots.txt)
- [ ] Configurar `docker-compose.prod.yml` compatible con Railway
- [ ] Conectar repo a Railway y configurar variables de entorno
- [ ] Verificar sitio vivo en URL de Railway

## Archivos Modificados

| Archivo | Cambio | Estado |
|---------|--------|--------|
| — | Ningún archivo modificado en esta sesión | — |

## Archivos Relevantes (solo lectura)

- `SPEC.md` — Especificación completa; Fase 6 (SEO + Deploy) detalla lo que se implementará
- `docker-compose.yml` — Base para crear el `docker-compose.prod.yml`
- `frontend/app/layout.tsx` — Donde va la metadata SEO global
- `backend/.env` — Variables de entorno SMTP ya configuradas; necesitarán equivalente en Railway

## Decisiones Tomadas

1. **Omitir Fase 5 (Admin)**: El usuario quiere validar el negocio antes de invertir en panel de gestión
2. **GitHub + Railway**: Elegido sobre Oracle Cloud (tuvo problemas de signup) y Render (cold starts). Railway es el path más rápido a producción
3. **Dominio propio opcional**: Se puede lanzar con subdominio de Railway (`epoxyart.up.railway.app`) y comprar dominio después (~$9) sin afectar la estrategia de marketing
4. **Marketing no cambia por el hosting**: Instagram, WhatsApp Business y Google Business Profile funcionan igual con subdominio de Railway

## Problemas / Bloqueos

- **Sin repositorio Git**: El proyecto no tiene `.git` — hay que crearlo e inicializarlo
- **Oracle Cloud**: El usuario tuvo problemas de acceso al signup; se optó por Railway como alternativa
- **Sin dominio propio**: No es bloqueante; Railway provee subdominio gratuito

## Para Reanudar

### Reanudacion automatica:

> El hook SessionStart cargara este checkpoint automaticamente al iniciar
> la proxima sesion de Claude Code en este proyecto. No se necesita ninguna
> instruccion manual.

### Siguiente paso exacto:

El usuario ya dio el OK para arrancar con GitHub + Railway. Ejecutar en orden:

1. **Crear repo GitHub**: `gh repo create epoxyart --public --source=. --push` (verificar que `gh` CLI esté instalado; si no, crear el repo manualmente en github.com y hacer push)
2. **Antes del primer commit**: revisar `.gitignore` para asegurar que `backend/.env` y `frontend/.env.local` no se suban
3. **SEO básico**: agregar metadata en `frontend/app/layout.tsx` (title, description, OG tags)
4. **sitemap.xml y robots.txt**: crear en `frontend/public/`
5. **docker-compose.prod.yml**: adaptar para Railway (variables de entorno por env vars, no por archivo `.env`)
6. **Railway**: conectar repo, configurar servicios y variables, hacer deploy
