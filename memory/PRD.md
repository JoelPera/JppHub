# JppHub - Product Requirements Document

## Original Problem Statement
"Quiero que las funciones de registrar usuarios y el login dentro de la web funcionen a la perfección, quiero que hagas que la web se vea mucho más profesional y hagas un SaaS, y panel Dashboard para aceptar o rechazar o poner otra vez en revisión los artículos para subirlos, cambia lo que necesites del index.html y del css para que se vea mucho más profesional"

## Tech Stack
- **Backend**: Node.js 20 + Express 4 (puerto 8001)
- **Base de datos**: MariaDB/MySQL 10.11 (compatible con MySQL 8+ en VPS del cliente)
- **Frontend**: HTML/CSS/JS vanilla servido por micro-server Express (puerto 3000)
- **Editor**: Quill 1.3.7 (CDN) WYSIWYG
- **Auth**: JWT email/password + Emergent-managed Google OAuth

## User Personas
1. **Visitante**: lee artículos aprobados en la home + detalle completo en `/articles/:slug`.
2. **Autor (rol `user`)**: se registra, envía artículos con editor WYSIWYG, ve su dashboard con estado por artículo, edita (vuelve a `pending`).
3. **Admin (rol `admin`)**: accede al panel `/admin`, cola de revisión, aprueba / rechaza / vuelve a revisión con nota, gestiona usuarios y roles.

## Core Requirements (DONE)
- ✅ Registro y login (JWT + Google OAuth)
- ✅ Diseño profesional SaaS con paleta teal/azul
- ✅ Dashboard admin con accept/reject/review articles
- ✅ Solo artículos aprobados aparecen públicos

## What's been implemented

### Iteración 1 (Abr 2026)
**Backend**
- MariaDB + schema con tablas users, posts (con flujo `pending`/`in_review`/`approved`/`rejected`/`draft`), categories, sessions, activity_logs, contact_messages
- Fix bugs: `authorize` export, `sessionRepository`, `userRepository.findAll`
- Endpoints articles completos + review + admin stats + users + role management
- Google OAuth endpoint `/api/auth/google/session`
- Seed idempotente: admin + autor demo + 2 artículos

**Frontend**
- CSS rediseñado: sistema de diseño SaaS (Sora + Manrope)
- Landing, Login, Register, Dashboard usuario, Panel admin con 3 tabs
- data-testid en elementos interactivos

### Iteración 2 (Abr 2026) - P1 Features
**Página de detalle `/articles/:slug`**
- Endpoint `GET /api/articles/slug/:slug` (200 si approved, 404 si no)
- Página pública con tipografía serif (Lora) para lectura, render HTML de Quill
- Cards del home linkean al detalle, auto-incremento de vistas

**Editor WYSIWYG (Quill)**
- Toolbar: headings, bold/italic/underline/strike, blockquote, code, lists, link, clean
- Tema oscuro custom matcheando la paleta
- Carga HTML preexistente al editar
- Content guardado como HTML, renderizado tal cual en detalle

**Paginación admin**
- Client-side, PAGE_SIZE=10
- Tablas Artículos y Usuarios
- Info "Página X de Y · N resultados" + botones Anterior/Siguiente
- Cambiar filtro reinicia a página 1

## Testing Results
- Iter 1: 13/13 backend, 100% flujos frontend (2 issues UX menores → corregidos)
- Iter 2: 17/17 backend, 100% frontend, **0 issues**

## Prioritized Backlog

### P2 (Next)
- **Email notifications** (SendGrid/Resend) al aprobar/rechazar — mejora retención
- Paginación server-side (cuando BD crezca a miles de artículos)
- Page-size selector en admin

### P3 (Backlog)
- Categorías dinámicas desde DB en modal de envío
- Cover image upload (S3/Cloudinary)
- Comentarios en artículos
- Stripe subscriptions (schema ya existe)
- Analytics dashboard para autores

## Deployment a VPS
- Schema en `/app/backend/database/schema.sql` → ejecutar en MySQL de producción
- Cambiar credenciales en `backend/.env` (DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET)
- `npm install` en backend, luego `node server.js` (o PM2/systemd)
- nginx sirve frontend estático + reverse-proxy `/api` → puerto backend
