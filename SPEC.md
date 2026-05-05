# EpoxyArt — Especificación Técnica Completa
## Documento de instrucciones para Claude Code

---

## 🎯 Visión General del Proyecto

Desarrollar un sitio web profesional para un negocio de **decoración en resina epóxica** enfocado en pisos y paredes. El sitio debe ser visualmente impactante, funcional e inteligente, con un módulo de análisis de imagen por IA que recomiende colores, texturas y acabados según el espacio del cliente.

**Nombre del negocio:** EpoxyArt  
**Stack:** 100% Open Source  
**Deploy:** VPS Ubuntu (Oracle Cloud Free Tier o Hetzner)  
**Idioma de la interfaz:** Español  

---

## 📐 Reglas Generales del Proyecto

1. **Todo el código debe ser open source** — cero dependencias de servicios de pago obligatorio.
2. **Mobile-first** — diseño responsivo desde 320px hasta 4K.
3. **Sin frameworks CSS de pago** — usar Tailwind CSS (open source).
4. **Commits semánticos** — feat:, fix:, chore:, docs: en cada commit.
5. **Variables de entorno** — NUNCA hardcodear claves, URLs o credenciales en el código.
6. **Docker Compose** — todo el stack debe correr con `docker compose up`.
7. **TypeScript estricto** — `strict: true` en tsconfig. Sin `any` implícito.
8. **Sin dependencias innecesarias** — antes de instalar un paquete, verificar si se puede resolver con código nativo.
9. **Accesibilidad** — cumplir WCAG 2.1 AA: aria-labels, contraste de colores, navegación por teclado.
10. **SEO** — metadata completa, Open Graph, sitemap.xml, robots.txt, schema.org para negocio local.

---

## 🛠️ Stack Tecnológico

### Frontend
| Herramienta | Versión | Propósito |
|---|---|---|
| Next.js | 14+ (App Router) | Framework React con SSR/SSG |
| TypeScript | 5+ | Tipado estático |
| Tailwind CSS | 3+ | Estilos utilitarios |
| Framer Motion | latest | Animaciones fluidas |
| React Hook Form | latest | Manejo de formularios |
| Zod | latest | Validación de esquemas |
| next-i18next | latest | Internacionalización (es/en) |
| Swiper.js | latest | Galería y carruseles |
| Sharp | latest | Optimización de imágenes |

### Backend
| Herramienta | Versión | Propósito |
|---|---|---|
| FastAPI | 0.110+ | API REST principal |
| Python | 3.11+ | Lenguaje del backend |
| SQLAlchemy | 2.0+ | ORM para base de datos |
| Alembic | latest | Migraciones de BD |
| Pydantic | v2 | Validación y schemas |
| Celery | latest | Tareas asíncronas (emails) |
| Redis | 7+ | Cache y cola de tareas |
| Pillow | latest | Procesamiento de imágenes |

### Base de Datos
| Herramienta | Propósito |
|---|---|
| PostgreSQL 16 | Base de datos principal |
| Redis 7 | Cache y sesiones |

### IA / Análisis de Imágenes
| Herramienta | Propósito |
|---|---|
| Anthropic API (claude-sonnet-4-20250514) | Análisis de imagen y recomendaciones |
| Pillow | Pre-procesamiento de imagen antes de envío |

> **Nota:** Usar la API de Anthropic para análisis de imagen. El endpoint es `https://api.anthropic.com/v1/messages` con soporte de visión. La API key se configura en `.env` como `ANTHROPIC_API_KEY`.

### Infraestructura
| Herramienta | Propósito |
|---|---|
| Docker + Docker Compose | Contenedores |
| Nginx | Reverse proxy + SSL termination |
| Certbot (Let's Encrypt) | Certificados SSL gratuitos |
| GitHub Actions | CI/CD |
| Resend (free tier) o SMTP propio | Envío de emails |

---

## 📁 Estructura de Directorios

```
epoxyart/
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing principal
│   │   ├── galeria/
│   │   │   └── page.tsx
│   │   ├── servicios/
│   │   │   └── page.tsx
│   │   ├── cotizar/
│   │   │   └── page.tsx
│   │   └── api/                # Next.js API routes (proxy al backend)
│   │       └── analyze/
│   │           └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── AIAnalyzer.tsx
│   │   │   ├── QuoteForm.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Process.tsx
│   │   │   └── FAQ.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── api.ts              # Cliente HTTP hacia el backend
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useQuote.ts
│   │   └── useImageAnalysis.ts
│   ├── types/
│   │   └── index.ts
│   ├── public/
│   │   ├── images/
│   │   └── fonts/
│   ├── .env.local.example
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                    # FastAPI App
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py       # Settings con pydantic-settings
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py
│   │   │       ├── quotes.py
│   │   │       ├── analyze.py
│   │   │       ├── gallery.py
│   │   │       └── contact.py
│   │   ├── models/
│   │   │   ├── quote.py
│   │   │   ├── gallery.py
│   │   │   └── contact.py
│   │   ├── schemas/
│   │   │   ├── quote.py
│   │   │   ├── analyze.py
│   │   │   └── contact.py
│   │   ├── services/
│   │   │   ├── ai_analyzer.py  # Lógica de análisis con Anthropic
│   │   │   ├── email.py
│   │   │   └── price_calc.py
│   │   └── tasks/
│   │       └── email_tasks.py  # Celery tasks
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       └── epoxyart.conf
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 🚀 Fases del Proyecto

---

### FASE 1 — Fundación e Infraestructura
**Objetivo:** Tener el proyecto corriendo localmente con Docker y la estructura base lista.

**Tareas:**
- [ ] Inicializar repositorio Git con `.gitignore` apropiado
- [ ] Crear `docker-compose.yml` con servicios: `frontend`, `backend`, `postgres`, `redis`, `nginx`
- [ ] Configurar Next.js 14 con TypeScript, Tailwind CSS y App Router
- [ ] Configurar FastAPI con estructura de carpetas, CORS y health check en `/api/health`
- [ ] Configurar PostgreSQL con usuario, contraseña y base de datos inicial
- [ ] Configurar Alembic para migraciones
- [ ] Crear archivos `.env.example` para frontend y backend
- [ ] Configurar Nginx como reverse proxy (frontend en `/`, backend en `/api/`)
- [ ] Verificar que `docker compose up` levanta todo el stack sin errores

**Entregable:** `docker compose up` → frontend en `localhost:3000`, backend en `localhost:8000/docs`

---

### FASE 2 — Landing Page y Diseño Visual
**Objetivo:** Implementar la landing page completa con el diseño oscuro y dorado, con todas las secciones.

**Paleta de colores (definir en Tailwind config):**
```js
colors: {
  gold: { DEFAULT: '#c9a84c', light: '#e8c97a', dark: '#8b6914' },
  dark: { DEFAULT: '#0e0e0e', 2: '#1a1a1a', 3: '#242424' },
  epoxy: { teal: '#3d8c6e', teal2: '#56bf97' },
  light: '#f5f0e8',
  muted: '#9a8f7f',
}
```

**Secciones a implementar (en orden):**

#### 2.1 Navbar
- Logo "EPOXYART" con tipografía contrastada
- Links: Servicios, Diseño IA, Cotizar, Galería
- CTA button "COTIZAR AHORA" dorado
- Fondo transparente con blur al hacer scroll
- Menú hamburguesa en mobile

#### 2.2 Hero Section
- Fondo con animación canvas (blobs de resina fluyendo — ver código de referencia en prototipo)
- Badge "Resina Epóxica Premium"
- H1: "Transforma tus Espacios con Arte Líquido"
- Subtítulo descriptivo
- Dos CTAs: "Probar Diseño con IA" y "Solicitar Cotización"
- Estadísticas: +350 Proyectos · 8+ Años · 100% Garantía
- Animación de entrada con Framer Motion (fade + slide up)

#### 2.3 Servicios
- Grid de 6 tarjetas (3 columnas desktop, 1 mobile)
- Ícono, título, descripción y precio base
- Hover effect: borde dorado animado desde la izquierda
- Servicios: Piso Residencial ($80/m²), Piso Comercial ($65/m²), Paredes Decorativas ($120/m²), Acabados Especiales, Renovación ($55/m²), Exteriores/Piscinas ($70/m²)

#### 2.4 Proceso de Trabajo
- 4 pasos numerados: Consulta → Diseño IA → Preparación → Aplicación
- Layout horizontal en desktop, vertical en mobile
- Ícono + número + título + descripción corta

#### 2.5 Analizador IA (ver Fase 3 para lógica)
- Panel upload de foto (drag & drop + click)
- Preview de imagen subida
- Área de resultados con paleta de colores y sugerencias
- Esqueleto de carga animado mientras procesa
- Botón "Usar esta selección en cotización"

#### 2.6 Cotizador Interactivo
- Formulario: nombre, teléfono, email, ciudad
- Select: tipo de superficie
- Slider: área en m² (5 — 500)
- Select: tipo de acabado con multiplicadores de precio
- Preview de precio en tiempo real (sin llamada al backend)
- Al enviar: llamada POST `/api/v1/quotes` + email de confirmación
- Validación con React Hook Form + Zod

#### 2.7 Galería
- Grid masonry con imágenes generadas (canvas procedural para el prototipo, reemplazables por fotos reales)
- Lightbox al hacer clic (modal con imagen grande)
- Filtros: Todos / Pisos / Paredes / Comercial / Residencial
- Lazy loading con Next.js `<Image>`

#### 2.8 Testimonios
- Carrusel con Swiper.js
- Avatar, nombre, ciudad, calificación (estrellas), texto
- Datos mockeados inicialmente (5 testimonios)

#### 2.9 FAQ
- Acordeón animado con Framer Motion
- 8 preguntas frecuentes sobre el servicio
- Schema.org FAQPage para SEO

#### 2.10 Footer
- Logo, descripción corta
- Links de navegación
- Redes sociales (Instagram, WhatsApp, Facebook)
- Datos de contacto
- Copyright

**Entregable:** Sitio visual completo y responsivo, sin funcionalidad de backend aún.

---

### FASE 3 — Módulo de Análisis IA
**Objetivo:** Implementar el análisis real de imagen con la API de Anthropic.

#### 3.1 Backend — Servicio de Análisis (`backend/app/services/ai_analyzer.py`)

```python
# Lógica esperada del servicio:
# 1. Recibir imagen en base64 desde el frontend
# 2. Pre-procesar con Pillow: redimensionar a max 1024px, convertir a JPEG, comprimir
# 3. Enviar a Anthropic API con el siguiente prompt de sistema:

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
```

#### 3.2 Endpoint de Análisis

```
POST /api/v1/analyze
Content-Type: multipart/form-data

Body:
  - image: File (JPG/PNG, max 10MB)
  - surface_type: str ("piso" | "pared")

Response 200:
{
  "success": true,
  "analysis": { ...estructura del JSON definido arriba... },
  "processing_time_ms": 1234
}

Response 422: Error de validación
Response 413: Imagen demasiado grande
Response 500: Error de la API de IA
```

#### 3.3 Frontend — Hook `useImageAnalysis.ts`

```typescript
// Debe manejar:
// - Estado: idle | uploading | analyzing | success | error
// - Upload de archivo con validación (tipo, tamaño)
// - Preview local con FileReader (no esperar al backend)
// - Llamada al backend con FormData
// - Parseo de la respuesta y estado de resultados
// - Manejo de errores con mensajes amigables en español
```

#### 3.4 Componente `AIAnalyzer.tsx`

Estados visuales a implementar:
1. **Idle:** Zona de drop con instrucciones
2. **Preview:** Imagen cargada localmente, botón "Analizar"
3. **Loading:** Skeleton + mensaje animado "Analizando tu espacio..."
4. **Results:** Paletas de color clicables, tarjetas de textura, acordeón con detalles
5. **Error:** Mensaje de error con botón reintentar

Al seleccionar una paleta/textura, pre-llenar los campos del cotizador.

**Entregable:** Usuario sube foto → recibe análisis real de IA en ~5 segundos.

---

### FASE 4 — Backend Completo y Formularios

#### 4.1 Modelo de Cotización (`Quote`)

```python
# Campos:
# id, created_at, updated_at
# nombre, email, telefono, ciudad
# tipo_superficie (enum), area_m2 (float), tipo_acabado (str)
# paleta_seleccionada (JSON), textura_seleccionada (str)
# precio_estimado (decimal), mensaje (text)
# estado: enum(pendiente, contactado, en_proceso, completado, cancelado)
# imagen_analizada (bool), analysis_result (JSON nullable)
```

#### 4.2 Endpoints requeridos

```
POST   /api/v1/quotes          → Crear cotización + enviar emails
GET    /api/v1/quotes          → Listar (protegido, solo admin)
GET    /api/v1/quotes/{id}     → Detalle (protegido)
PATCH  /api/v1/quotes/{id}     → Actualizar estado (protegido)

POST   /api/v1/contact         → Mensaje de contacto simple
GET    /api/v1/gallery         → Listar items de galería
POST   /api/v1/gallery         → Agregar item (protegido)

GET    /api/health             → Health check público
```

#### 4.3 Sistema de Emails

Al recibir una cotización, disparar dos emails asincrónicos vía Celery:

**Email al cliente:**
- Asunto: "¡Recibimos tu solicitud! — EpoxyArt"
- Contenido HTML: confirmación con resumen de su cotización, precio estimado y próximos pasos
- Template: `templates/email/quote_confirmation.html`

**Email al negocio:**
- Asunto: "Nueva cotización — {nombre_cliente} — {area}m² — {tipo}"
- Contenido: todos los datos del cliente + resultado del análisis IA si aplica
- Template: `templates/email/quote_notification.html`

Configuración de email: SMTP genérico configurable vía variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, `EMAIL_TO`).

#### 4.4 Rate Limiting

- `/api/v1/analyze`: máximo 10 requests por IP por hora
- `/api/v1/quotes`: máximo 5 requests por IP por hora
- `/api/v1/contact`: máximo 3 requests por IP por hora

Implementar con `slowapi` (open source, basado en Redis).

**Entregable:** Formularios funcionales, emails llegando, datos guardados en PostgreSQL.

---

### FASE 5 — Panel de Administración

**Objetivo:** Interfaz privada para gestionar cotizaciones.

**Ruta:** `/admin` (protegida con autenticación básica JWT)

#### 5.1 Autenticación
- Login con email + contraseña (usuario admin creado con script `create_admin.py`)
- JWT con expiración de 24h
- Refresh token almacenado en httpOnly cookie

#### 5.2 Vistas del Panel

**Dashboard:** métricas clave (cotizaciones totales, pendientes, esta semana, ingresos estimados)

**Lista de cotizaciones:**
- Tabla con: nombre, ciudad, superficie, área, precio estimado, estado, fecha
- Filtros: por estado, por fecha, por tipo de superficie
- Búsqueda por nombre o email
- Cambiar estado desde la tabla (dropdown inline)

**Detalle de cotización:**
- Todos los datos del cliente
- Si se analizó imagen: mostrar paleta y texturas seleccionadas
- Historial de cambios de estado
- Botón "Marcar como contactado / En proceso / Completado"
- Notas internas (campo editable)

**Galería (CMS simple):**
- Subir fotos de proyectos realizados
- Título, descripción, tipo (piso/pared), ubicación
- Activar/desactivar visibilidad

**Entregable:** Panel `/admin` funcional y protegido.

---

### FASE 6 — SEO, Performance y Deploy

#### 6.1 SEO
- Metadata dinámica con `generateMetadata` en cada página
- Open Graph completo (título, descripción, imagen, URL)
- Schema.org `LocalBusiness` + `Service` + `FAQPage`
- `sitemap.xml` generado automáticamente
- `robots.txt` configurado
- URLs amigables en español

#### 6.2 Performance
- `next/image` para todas las imágenes con `priority` en el hero
- Lazy loading en secciones below-the-fold
- Fonts optimizadas con `next/font`
- Bundle analysis con `@next/bundle-analyzer`
- Cache de respuestas de IA en Redis (TTL 1h, clave = hash de imagen)
- Lighthouse score objetivo: Performance >90, Accessibility >95, SEO >95

#### 6.3 Configuración Docker Producción

```yaml
# docker-compose.prod.yml debe incluir:
# - frontend: next build + next start
# - backend: uvicorn con workers según CPU
# - nginx: con SSL, gzip, caché de assets estáticos
# - certbot: renovación automática de certificados Let's Encrypt
# - postgres: con volumen persistente + backup diario
# - redis: con persistencia AOF
```

#### 6.4 CI/CD con GitHub Actions

Pipeline en `.github/workflows/deploy.yml`:
1. En push a `main`: correr tests, build Docker, push a registry, SSH al servidor y `docker compose pull && docker compose up -d`
2. Notificación por email al completar deploy

#### 6.5 Checklist de Deploy en VPS

```bash
# Comandos a ejecutar en el servidor (documentar en README):
git clone https://github.com/usuario/epoxyart
cd epoxyart
cp backend/.env.example backend/.env   # Editar con valores reales
cp frontend/.env.local.example frontend/.env.local
docker compose -f docker-compose.prod.yml up -d
docker compose exec backend alembic upgrade head
docker compose exec backend python create_admin.py
```

**Entregable:** Sitio en producción con HTTPS, velocidad óptima y deploy automatizado.

---

## 🔐 Variables de Entorno

### Backend (`.env`)
```env
# Base de datos
DATABASE_URL=postgresql+asyncpg://epoxyart:password@postgres:5432/epoxyart_db
REDIS_URL=redis://redis:6379/0

# IA
ANTHROPIC_API_KEY=sk-ant-...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contacto@epoxyart.co
SMTP_PASSWORD=...
EMAIL_FROM=EpoxyArt <contacto@epoxyart.co>
EMAIL_TO=admin@epoxyart.co

# Seguridad
SECRET_KEY=generate-with-openssl-rand-hex-32
ALLOWED_ORIGINS=https://epoxyart.co,https://www.epoxyart.co

# App
ENVIRONMENT=production
DEBUG=false
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://epoxyart.co/api
NEXT_PUBLIC_SITE_URL=https://epoxyart.co
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/epoxyart
```

---

## 🧪 Tests Requeridos

### Backend (pytest)
- `test_health.py` — endpoint de salud
- `test_quotes.py` — crear, listar, actualizar cotizaciones
- `test_analyze.py` — con imagen mock, verificar estructura de respuesta
- `test_rate_limiting.py` — verificar límites por IP
- `test_email.py` — mock del servicio SMTP

### Frontend (Jest + Testing Library)
- `QuoteForm.test.tsx` — validaciones, cálculo de precio
- `AIAnalyzer.test.tsx` — estados del componente
- `useImageAnalysis.test.ts` — hook con fetch mockeado

**Cobertura mínima:** 70%

---

## 📦 Comandos de Desarrollo

```bash
# Levantar todo el stack
docker compose up

# Solo el frontend (desarrollo rápido)
cd frontend && npm run dev

# Solo el backend
cd backend && uvicorn app.main:app --reload

# Crear migración
docker compose exec backend alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
docker compose exec backend alembic upgrade head

# Crear admin
docker compose exec backend python create_admin.py

# Correr tests backend
docker compose exec backend pytest -v

# Correr tests frontend
cd frontend && npm run test

# Build de producción
docker compose -f docker-compose.prod.yml build
```

---

## 📋 Orden de Ejecución para Claude Code

Ejecutar las fases en este orden estricto. **No avanzar a la siguiente fase hasta completar la actual:**

```
1. FASE 1 → Verificar con: docker compose up → todo verde
2. FASE 2 → Verificar con: inspección visual en localhost:3000
3. FASE 3 → Verificar con: subir foto real y ver análisis de IA
4. FASE 4 → Verificar con: enviar cotización y recibir email
5. FASE 5 → Verificar con: login en /admin y gestionar una cotización
6. FASE 6 → Verificar con: Lighthouse score y sitio en dominio real con HTTPS
```

---

## ✅ Definición de "Proyecto Completo"

El proyecto se considera terminado cuando:
- [ ] `docker compose up` levanta todo sin errores
- [ ] Landing page es visualmente idéntica al prototipo aprobado
- [ ] Análisis de imagen con IA real funciona en < 8 segundos
- [ ] Cotizador calcula precios en tiempo real y envía emails
- [ ] Panel `/admin` permite gestionar cotizaciones
- [ ] Lighthouse: Performance > 90 en mobile
- [ ] HTTPS activo con certificado válido
- [ ] README completo con instrucciones de instalación y deploy
- [ ] Todos los tests pasan (`pytest` y `npm test`)
- [ ] Sin secrets en el repositorio (verificar con `git log --all`)

---

*Documento generado para EpoxyArt · Stack 100% Open Source · v1.0*
