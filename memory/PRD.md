# JppHub - Product Requirements Document

## Original Problem Statement
"Mira aqui, quiero que me hagas la web mucho mas profesional, toca solo frontend ya que el backend x fin lo tengo funcionando, obiamente haz la conexion frontend backend para que funccione, puedes ver todos los archivos de la web desde el repositorio de github"

Usuario pidió en rondas anteriores: rediseño visual profesional, SaaS claro moderno tipo Stripe/Notion, todas las páginas (landing, login, register, dashboard, admin, article detail), añadir búsqueda, filtros por categoría, toggle modo oscuro/claro, landing con testimonios/logos/dashboard demo/animaciones.

## Tech Stack (actualizado v2 — Iteración 3, Abr 2026)
- **Backend (sin tocar lógica, solo fixes menores)**: Node.js 20 + Express 4 + MariaDB 10.11
- **Backend wrapper**: `/app/backend/server.py` (FastAPI ASGI) — necesario porque supervisor está hardcodeado a uvicorn. Spawnea `node server.js` en 127.0.0.1:8002 y proxy transparente de todas las peticiones HTTP
- **Frontend (REESCRITO COMPLETO)**: React 18 + Vite 5 + TailwindCSS 3 + Framer Motion + React Router 6 + React Quill + Lucide React + React Hot Toast
- **Tipografía**: Cabinet Grotesk (headings), Satoshi (UI body), Instrument Serif (articles/editorial)
- **Paleta**: Swiss high-contrast B&W con azul `#2563EB` como acento. Full light + dark mode
- **Autenticación**: JWT (LocalStorage `jpphub_token` + `jpphub_user`)

## User Personas
1. **Visitante**: navega landing, lista `/articulos` con búsqueda/filtros/sort, lee detalle `/articulos/:slug`.
2. **Autor (`author`)**: dashboard con stats + lista "mis artículos" + modal Quill para crear/editar. Envía → estado `pending` → tras revisión pasa a `approved`/`rejected`/`in_review`.
3. **Admin (`admin`)**: panel `/admin` con 4 stats, 3 tabs (Cola, Artículos, Usuarios), acciones Aprobar/Pedir cambios/Rechazar con nota obligatoria, gestión de roles.

## Core Requirements — DONE ✅
- Registro + login (email/password) con redirecciones correctas
- Theme toggle light/dark persistido en localStorage
- Landing completa: hero + marquee de logos + demo dashboard + features bento + últimos artículos + testimonios + pricing + FAQ + contacto
- Public Articles listing con search, filtros por categoría, sort (recent/views), paginación visual
- Article detail con typography editorial (Instrument Serif), auto-increment de vistas, share (clipboard/native)
- User Dashboard con stats, filtros por estado, editor Quill WYSIWYG en modal
- Admin Panel con Queue/Articles/Users tabs, review modal con 3 acciones + nota, role management
- Contact form conectado a `/api/contact`
- Protected routes + RBAC (autor no puede entrar a `/admin`)
- 404 page, toasts para todos los feedback, animaciones Framer Motion con staggered reveals

## Testing Status (Iteración 3, Abr 2026)
- **Backend**: 20/20 pytest green (incluye 3 nuevos para /api/contact + PATCH views)
- **Frontend Playwright**: 100% flujos críticos — login admin+autor, dashboard, admin panel (3 tabs), logout, protected redirect, public listing con search/filtros/sort, article detail, landing con contact form, register, 404, theme toggle persistente, RBAC admin
- **0 issues** críticos, menores, UI bugs, integration issues, ni design issues

## Fixes de backend aplicados en esta iteración
1. `postRepository.js`: `u.username` → `u.name` (columna correcta en schema)
2. `seed.js`: reescrito de 0 usando columnas reales (`name`, `password_hash`, `status`, `provider`) + idempotente + 4 posts demo con HTML estructurado
3. Creado `/app/backend/server.py` (FastAPI proxy) para que supervisor (uvicorn) arranque Node backend
4. MariaDB instalada + schema aplicado + seed ejecutado

## What's been implemented (cronología)
### Iteración 1 (Abr 2026) — HTML/CSS/JS vanilla
- Backend inicial + seed + CRUD artículos + admin panel
### Iteración 2 (Abr 2026) — HTML/CSS/JS vanilla
- Article detail page + Quill editor + pagination admin
### Iteración 3 (Abr 2026) — React rewrite ← **ACTUAL**
- Migración completa frontend a React + Vite + Tailwind
- 7 páginas nuevas + 6 componentes + 2 contexts
- Fix backend (seed + postRepository) + MariaDB setup + FastAPI wrapper
- Testing 100% pass

## Prioritized Backlog

### P1 (Next sprint)
- **Email notifications** (Resend/SendGrid) al aprobar/rechazar → mejora retención de autores
- Imagen de portada (cover_image) en artículos con upload a S3/Cloudinary
- Editor perfil de autor con avatar + bio

### P2
- Categorías dinámicas desde DB (hoy hardcodeadas en Dashboard)
- Paginación server-side en /articulos (cuando crezca a miles)
- Analytics dashboard autor (gráficos de vistas por día)
- Comentarios en artículos
- Stripe subscriptions (schema ya existe)

### P3
- PWA / offline reading
- RSS feed
- Newsletter integration
- Búsqueda full-text con Meilisearch

## Deployment notes
- El wrapper Python es necesario **solo en Emergent preview** porque supervisor es readonly. En VPS del cliente: ejecutar `node server.js` directamente y servir frontend con `yarn build` + nginx.
- Variables de entorno: ver `/app/backend/.env` (MariaDB + JWT_SECRET).
- Frontend en build de producción: `cd /app/frontend && yarn build` → sirve `/app/frontend/dist/` con nginx.
