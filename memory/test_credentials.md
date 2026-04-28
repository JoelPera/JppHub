# JppHub - Test Credentials

## Cuentas seed (creadas automáticamente al iniciar backend, idempotente)

### Administrador
- Email: `admin@jpphub.com`
- Password: `Admin123!`
- Role: `admin`
- Puede: aprobar/rechazar/volver a revisión artículos, gestionar usuarios, todo.

### Autor demo
- Email: `autor@jpphub.com`
- Password: `Autor123!`
- Role: `author`
- Puede: enviar artículos, ver sus artículos con estado.

## Base de datos (desarrollo local)
- Tipo: MariaDB 10.11 (compatible con MySQL 8+)
- Host: 127.0.0.1:3306
- Database: `jpphub`
- User: `jpphub`
- Password: `jpphub_dev_2026`

## URLs
- Frontend público: https://web-modernize-7.preview.emergentagent.com
- Backend API: mismo dominio bajo `/api/*` (redirect ingress a puerto 8001)

## Google OAuth (Emergent)
- No usa password app-managed
- Flujo: redirigir a `https://auth.emergentagent.com/?redirect={origin}/dashboard`
- Callback: `#session_id=XXX` → POST `/api/auth/google/session` → retorna JWT propio
