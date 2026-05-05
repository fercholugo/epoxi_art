# EpoxyArt

Sitio web profesional para negocio de decoración en resina epóxica con análisis de imagen por IA.

## Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python 3.11, SQLAlchemy, Alembic
- **Base de datos:** PostgreSQL 16, Redis 7
- **IA:** Anthropic API (Claude Sonnet)
- **Infraestructura:** Docker Compose, Nginx

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/epoxyart
cd epoxyart

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Editar ambos archivos con tus valores reales

# 3. Levantar el stack
docker compose up --build
```

## URLs de desarrollo

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/docs |
| Health check | http://localhost:8000/api/health |
| Via Nginx | http://localhost |

## Comandos útiles

```bash
# Levantar en background
docker compose up -d --build

# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Crear migración de base de datos
docker compose exec backend alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
docker compose exec backend alembic upgrade head

# Correr tests backend
docker compose exec backend pytest -v

# Correr tests frontend
docker compose exec frontend npm run test

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker compose down -v
```

## Fases del proyecto

1. **Fase 1** — Fundación e Infraestructura ✅
2. **Fase 2** — Landing Page y Diseño Visual
3. **Fase 3** — Módulo de Análisis IA
4. **Fase 4** — Backend Completo y Formularios
5. **Fase 5** — Panel de Administración
6. **Fase 6** — SEO, Performance y Deploy
