# JppHub - Product Requirements Document

## Original Problem Statement
"Quiero que las funciones de registrar usuarios y el login dentro de la web funcionen a la perfección, quiero que hagas que la web se vea mucho más profesional y hagas un SaaS, y panel Dashboard para aceptar o rechazar o poner otra vez en revisión los artículos para subirlos, cambia lo que necesites del index.html y del css para que se vea mucho más profesional"

## Tech Stack (real, de este proyecto)
- **Backend**: Node.js 20 + Express 4 (puerto 8001)
- **Base de datos**: MariaDB/MySQL 10.11 (compatible con MySQL 8+ en VPS del cliente)
- **Frontend**: HTML/CSS/JS vanilla servido estáticamente por un micro-server Express (puerto 3000)
- **Auth**: JWT email/password + Emergent-managed Google OAuth (social login)

## User Personas
1. **Visitante**: lee artículos aprobados en la home.
2. **Autor (rol `user`)**: se registra, envía artículos a revisión, ve su dashboard con el estado de cada envío, puede editar (reenvía a revisión).
3. **Admin (rol `admin`)**: accede al panel /admin, ve la cola de revisión, aprueba / rechaza / pone en revisión con nota, gestiona usuarios y roles.

## Core Requirements
- Registro y login funcionales (JWT + Google OAuth)
- Diseño profesional SaaS
- Dashboard admin para aprobar/rechazar/volver a revisión artículos antes de publicarlos
- Solo artículos aprobados aparecen en la web pública

## What's been implemented (iteración 1 - Abril 2026)
### Backend
- MariaDB instalado localmente con schema completo (users, posts, categories, sessions, activity_logs, contact_messages)
- Fix bug `authorize` inexistente en `roleMiddleware.js` (ahora exporta `permit` y `authorize` como alias)
- `sessionRepository` reescrito para matchear schema
- `userRepository.findAll` añadido
- `postRepository` con flujo editorial SaaS (estados: `pending`, `in_review`, `approved`, `rejected`, `draft`)
- `articleService` con lógica de roles: autor solo edita sus propios, admin todo; ediciones de autor vuelven a `pending`
- Endpoints Admin: `/api/admin/stats`, `/api/admin/users`, `/api/admin/users/:id/role`
- Endpoint revisión: `POST /api/articles/:id/review` con action `approve|reject|review` y nota
- Endpoint Google OAuth: `POST /api/auth/google/session` (recibe session_id, upsert usuario con provider='google', retorna JWT propio)
- Seed idempotente: admin@jpphub.com + autor@jpphub.com + 2 artículos demo (1 approved, 1 pending)
- `/auth/me` devuelve usuario completo desde DB (no solo payload JWT)

### Frontend
- CSS rediseñado desde cero: sistema de diseño SaaS profesional
  - Paleta oscura con acento teal (#14e0b1) + azul (#5b8def)
  - Tipografías: Sora (display) + Manrope (UI) desde Google Fonts
  - Componentes: botones pill, cards elevadas con hover, badges por estado, tablas, modales, sidebar
- Landing page rediseñada: hero con gradiente, features grid, blog (carga API), pricing, contacto (envía al backend)
- Login/Register modernos con sidebar branding + botón Google Login
- Dashboard usuario: stats cards, tabla "Mis artículos" con badges de estado, modal envío/edición
- Panel Admin: 3 tabs (Resumen/Artículos/Usuarios), cola de revisión, filtros por estado (chips), modal de revisión con botones Aprobar/Rechazar/Volver a revisión y nota
- `data-testid` en todos los elementos interactivos

### Infra
- Supervisor actualizado para correr Node backend :8001 + Express estático :3000 + mysql
- /app/auth_testing.md con playbook Google OAuth
- /app/memory/test_credentials.md

## Testing Results (iteración 1)
- Backend: 13/13 tests pytest pasando
- Frontend: todos los flujos críticos OK vía Playwright
- Flujo E2E validado: register → login → submit → admin approve → publicado en home

## Prioritized Backlog
### P1 (Next)
- Editor rich-text (Markdown o WYSIWYG) en lugar de textarea plano
- Paginación en listas de artículos admin
- Ver detalle del artículo en la web (`/articles/:slug`)

### P2
- Email notifications cuando un artículo es aprobado/rechazado
- Categorías dinámicas desde DB en el modal de envío
- Cover image upload

### P3 (Backlog)
- Comentarios en artículos
- Sistema de suscripciones con Stripe (schema ya existe)
- Analytics dashboard para autores
