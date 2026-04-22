# JppHub - Product Requirements Document

## Original Problem Statement (sesión actual)
"Mira aqui, quiero que me hagas la web mucho mas profesional, toca solo frontend ya que el backend x fin lo tengo funcionando, obiamente haz la conexion frontend backend para que funccione"
→ Luego: "P1: email notifications (Resend) al aprobar/rechazar · upload imagen de portada · página perfil autor con bio"

## Tech Stack
- **Backend**: Node.js 20 + Express 4 + MariaDB 10.11 (empresa usa MySQL en VPS, 100% compatible)
- **Backend wrapper**: `/app/backend/server.py` FastAPI ASGI proxy que spawnea Node en :8002 (necesario solo en Emergent preview, supervisor es readonly)
- **Frontend**: React 18 + Vite 5 + TailwindCSS 3 + Framer Motion + React Router 6 + React Quill + Lucide + React Hot Toast
- **Email**: Resend (npm `resend`, API key en `.env`, sender `onboarding@resend.dev` test mode)
- **Uploads**: Local filesystem (`/app/backend/uploads`) servido en `/api/uploads/files/*` vía multer + express.static
- **Tipografía**: Cabinet Grotesk (headings) + Satoshi (body) + Instrument Serif (artículos editorial)
- **Paleta**: B&W Swiss high-contrast + acento `#2563EB`. Light + Dark mode
- **Auth**: JWT en localStorage (`jpphub_token`, `jpphub_user`)

## User Personas
1. **Visitante**: landing + lista /articulos con search/filtros/sort + detalle /articulos/:slug + perfil público /autor/:id
2. **Autor (`author`/`user`)**: dashboard personal, modal Quill con cover image upload, /perfil para editar bio + avatar
3. **Admin**: panel /admin con 3 tabs, modal de revisión con 3 acciones (aprobar/pedir cambios/rechazar) + notas. Al revisar → email automático al autor

## Core Requirements — DONE ✅
- Registro + login (email/password) con redirecciones correctas
- Theme toggle light/dark persistido en localStorage
- Landing completa: hero + logos marquee + demo dashboard + bento features + últimos artículos + testimonios + pricing + FAQ + contacto
- Public Articles /articulos: search, filtros por categoría, sort recent/views
- Article detail /articulos/:slug con typography editorial + cover image + author link + auto-increment views
- User Dashboard /dashboard con stats, filtros por estado, modal Quill WYSIWYG + cover image uploader
- Admin Panel /admin con Queue/Articles/Users tabs, review modal con notas, role management
- **Email notifications (Resend)** al aprobar/rechazar/pedir cambios — HTML template con logo JppHub + CTA button + nota del editor. Non-blocking: nunca falla la acción si falla el envío.
- **Cover image upload** local: multer + 5MB limit + filtro mime + static serving `/api/uploads/files/*`. ImageUpload widget reutilizable
- **Perfil editable /perfil**: avatar, nombre, bio (500 caracteres max)
- **Perfil público /autor/:id**: bio + grid de artículos aprobados del autor
- **Author links** clickables en todas las cards + article detail header + article detail footer → /autor/:id
- Contact form `/api/contact`
- Protected routes + RBAC (autor no entra a /admin)
- 404 page, toasts para feedback, animaciones Framer Motion staggered

## Testing Status
- **Iteración 3** (React rewrite): 20/20 pytest backend + 100% Playwright frontend, 0 issues
- **Iteración 4** (P1 features): 31/31 pytest (11 nuevos P1) + 100% Playwright, 0 issues

## What's been implemented (cronología)
### Iteración 1-2 (Abr 2026) — HTML/CSS/JS vanilla
- Backend + seed + CRUD artículos + admin panel + article detail + Quill editor + pagination
### Iteración 3 (Abr 2026) — React rewrite
- Migración completa frontend a React + Vite + Tailwind, 7 páginas + 6 componentes + 2 contexts
- Fix backend: seed + postRepository bugs + MariaDB setup + Python FastAPI wrapper
### Iteración 4 (Abr 2026) — P1 features ← **ACTUAL**
- Resend email service (services/emailService.js) + integración en reviewArticle
- Upload endpoint /api/uploads + static serving /api/uploads/files/* + ImageUpload widget
- /perfil page (edit bio/name/avatar) + /autor/:id public page
- Author clickable links en cards + article detail
- Cover image rendering en cards (Articles, Landing, AuthorPublic) + article detail header
- Backend schema alignment: coverImage validator relajado + action 'request_changes' añadido

## Prioritized Backlog

### P2 (next sprint)
- **Newsletter semanal automática** con top 3 artículos aprobados (growth loop clásico, integración con Resend schedules)
- **Cron jobs**: auto-digest de cola pendiente al admin si >5 artículos esperan >24h
- **Categorías dinámicas** desde DB (hoy hardcodeadas en Dashboard)
- **Paginación server-side** en /articulos cuando crezca a miles de artículos
- **Bio/avatar validators** con Joi en backend (alinear con UI counter 500 chars + formato avatarUrl)
- **Quota de uploads** por usuario para evitar llenar disco (actualmente solo rate-limit general)

### P3 (backlog)
- Comentarios en artículos
- Analytics dashboard autor con gráficos de views/día
- Stripe subscriptions (schema ya existe)
- Búsqueda full-text con Meilisearch
- RSS feed
- PWA offline
- Verificar dominio en Resend para entrega real (hoy test mode solo envía al owner verificado)

## Deployment notes
- **Preview Emergent**: el wrapper Python (server.py) es necesario por supervisor hardcodeado. MariaDB instalada manualmente. Uploads persisten en `/app/backend/uploads`.
- **VPS cliente**: ejecutar `node server.js` directamente. Schema SQL en `/app/backend/database/schema.sql`. Frontend: `yarn build` + nginx sirviendo `dist/` con reverse-proxy `/api → node:8001`. Crear volumen persistente para `/app/backend/uploads` o migrar a S3/Cloudinary.
- **.env producción**:
  - `RESEND_API_KEY=re_xxx` (con dominio verificado)
  - `SENDER_EMAIL=notificaciones@tu-dominio.com`
  - `PUBLIC_BASE_URL=https://tu-dominio.com` (para los links dentro de emails)
  - `JWT_SECRET=<secreto largo random>`
  - Credenciales MariaDB reales
