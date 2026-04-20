# JppHub Backend API Documentation

## 📋 Tabla de Contenidos
1. [Overview](#overview)
2. [Arquitectura](#arquitectura)
3. [Endpoints API](#endpoints-api)
4. [Autenticación](#autenticación)
5. [Roles y Permisos](#roles-y-permisos)
6. [Validación de Datos](#validación-de-datos)
7. [Middleware](#middleware)
8. [Manejo de Errores](#manejo-de-errores)

## 🚀 Overview

**JppHub Backend** es una API RESTful de producción construida con:
- **Node.js** + **Express.js** con ES Modules
- **MySQL** como base de datos
- **JWT** para autenticación
- **Bcrypt** para hash de contraseñas
- **Joi** para validación de esquemas
- **Helmet** para seguridad HTTP
- **Rate Limiting** para protección contra abuso
- **XSS-Clean** para sanitización

## 🏗️ Arquitectura

El backend sigue un patrón de capas limpio:

```
routes/          → Definición de endpoints HTTP
├─ authRoutes.js
├─ articleRoutes.js
├─ categoryRoutes.js
├─ subscriptionRoutes.js
├─ paymentRoutes.js
├─ userRoutes.js
├─ adminRoutes.js
└─ contactRoutes.js

controllers/     → Manejadores de solicitudes HTTP
├─ authController.js
├─ articleController.js
├─ categoryController.js
├─ subscriptionController.js
├─ paymentController.js
├─ userController.js
├─ adminController.js
└─ contactController.js

services/        → Lógica de negocio
├─ authService.js
├─ articleService.js
├─ categoryService.js
├─ subscriptionService.js
├─ paymentService.js
├─ userService.js
├─ adminService.js
└─ contactService.js

repositories/    → Acceso a datos MySQL
├─ userRepository.js
├─ articleRepository.js
├─ postRepository.js
├─ categoryRepository.js
├─ subscriptionRepository.js
├─ paymentRepository.js
├─ sessionRepository.js
├─ contactRepository.js
└─ activityLogRepository.js

database/        → Pool de conexiones
└─ db.js

middleware/      → Autenticación, validación, error handling
├─ authMiddleware.js
├─ roleMiddleware.js
├─ validationMiddleware.js
├─ errorHandler.js
└─ requestLogger.js

validators/      → Esquemas de validación Joi
├─ authValidators.js
├─ articleValidators.js
├─ categoryValidators.js
├─ subscriptionValidators.js
├─ paymentValidators.js
└─ contactValidators.js
```

## 📡 Endpoints API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth | Parámetros |
|--------|----------|-------------|------|-----------|
| POST | `/register` | Registrar nuevo usuario | ❌ | `email`, `password`, `name` |
| POST | `/login` | Iniciar sesión | ❌ | `email`, `password` |
| POST | `/refresh` | Refrescar JWT token | ✅ | - |
| POST | `/logout` | Cerrar sesión | ✅ | - |

**Respuesta de Login exitoso:**
```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 📝 Artículos/Posts (`/api/articles`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Listar todos los artículos | ❌ | - |
| GET | `/:id` | Obtener artículo por ID | ❌ | - |
| PATCH | `/:id/views` | Incrementar contador de visitas | ❌ | - |
| POST | `/` | Crear nuevo artículo | ✅ | admin |
| PUT | `/:id` | Actualizar artículo | ✅ | admin |
| DELETE | `/:id` | Eliminar artículo | ✅ | admin |

**Crear artículo (POST /api/articles):**
```json
{
  "title": "Mi Primer Post",
  "description": "Una breve descripción",
  "content": "Contenido del artículo...",
  "category": "Tecnología",
  "author": "Admin",
  "status": "published"
}
```

### 📁 Categorías (`/api/categories`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Listar todas las categorías | ❌ | - |
| POST | `/` | Crear categoría | ✅ | admin |
| PUT | `/:id` | Actualizar categoría | ✅ | admin |
| DELETE | `/:id` | Eliminar categoría | ✅ | admin |

### 💳 Suscripciones (`/api/subscriptions`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener suscripción del usuario | ✅ | user |
| POST | `/` | Crear suscripción | ✅ | user |
| PATCH | `/cancel` | Cancelar suscripción | ✅ | user |

**Planes disponibles:** `basic`, `pro`, `enterprise`

**Crear suscripción (POST /api/subscriptions):**
```json
{
  "plan": "pro",
  "status": "active",
  "startedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2025-01-01T00:00:00Z",
  "payment": {
    "id": "uuid",
    "amount": 99.99,
    "currency": "USD",
    "status": "success",
    "provider": "stripe",
    "transactionId": "tx_1234567890"
  }
}
```

### 💰 Pagos (`/api/payments`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Listar pagos del usuario | ✅ | user |
| POST | `/` | Crear pago | ✅ | user |

### 👤 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/me` | Obtener perfil del usuario actual | ✅ | user |
| GET | `/` | Listar todos los usuarios | ✅ | admin |

### 🛡️ Admin (`/api/admin`)

**⚠️ Requiere autenticación y rol admin**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Listar todos los usuarios (admin) |
| GET | `/subscriptions` | Listar todas las suscripciones |
| GET | `/payments` | Listar todos los pagos |
| GET | `/activity` | Listar actividad de usuarios |

### 📧 Contacto (`/api/contact`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/` | Enviar mensaje de contacto | ❌ |
| GET | `/` | Listar mensajes de contacto | ✅ (admin) |

### 🏥 Health Check (`/api/health`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Estado de la API y base de datos |

**Respuesta:**
```json
{
  "status": "healthy",
  "uptime": 123456,
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected"
}
```

## 🔐 Autenticación

### JWT (JSON Web Tokens)

El backend utiliza JWT para autenticación sin estado:

1. **Login:** El usuario envía credenciales y recibe un token JWT
2. **Almacenamiento:** El cliente guarda el token (localStorage, sessionStorage o cookie)
3. **Envío:** Cada solicitud incluye el token en el header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Validación:** El servidor valida el token en cada solicitud

### Configuración JWT

En `.env`:
```
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=7d
```

### Flow de Autenticación

```
┌─────────┐                      ┌─────────┐                    ┌──────────┐
│ Cliente │                      │ Backend │                    │ Base de  │
│ (Front) │                      │ (API)   │                    │ Datos    │
└────┬────┘                      └────┬────┘                    └────┬─────┘
     │                                │                              │
     │  1. POST /api/auth/login  │                              │
     ├───────────────────────────────>│                              │
     │   {email, password}             │                              │
     │                                │  2. Buscar usuario        │
     │                                ├─────────────────────────────>│
     │                                │                              │
     │                                │  3. Validar contraseña    │
     │                                │<──────────User data ──────────│
     │                                │                              │
     │  4. Crear JWT                  │                              │
     │  5. Enviar token               │                              │
     │<────────────────────────────────│                              │
     │   {token, user}                 │                              │
     │                                │                              │
     │  6. Solicitud con token        │                              │
     │  GET /api/articles/123         │                              │
     ├───────────────────────────────>│                              │
     │   Authorization: Bearer token   │                              │
     │                                │  7. Validar JWT          │
     │                                │  8. Verificar rol        │
     │                                │  9. Ejecutar acción      │
     │                                ├─────────────────────────────>│
     │                                │                              │
     │                                │<──────article data ─────────│
     │<────────────────────────────────│                              │
     │   {article}                     │                              │
```

## 👥 Roles y Permisos

### Roles disponibles:
- **admin:** Acceso completo al sistema
- **user:** Acceso a funciones de usuario regular
- **premium:** Usuario con suscripción activa (extensión futura)

### Matrix de permisos:

| Recurso | GET | POST | PUT | DELETE | Anónimo | User | Admin |
|---------|-----|------|-----|--------|---------|------|-------|
| Artículos | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Categorías | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Suscripciones | ✅* | ✅* | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pagos | ✅* | ✅* | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin (todo) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Perfil de usuario | ✅* | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

*Solo acceso a datos propios

## ✅ Validación de Datos

El backend utiliza **Joi** para validación de esquemas. Todos los datos se validan antes de procesarlos.

### Validadores disponibles:

#### Autenticación
```javascript
// POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",  // Min 8 chars, números, mayúsculas, especiales
  "name": "Full Name"
}

// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Artículos
```javascript
{
  "title": "string (required, 3-200 chars)",
  "description": "string (optional, 0-500 chars)",
  "content": "string (required)",
  "category": "string (optional)",
  "author": "string (optional)",
  "status": "draft | published (optional, default: draft)"
}
```

#### Categorías
```javascript
{
  "name": "string (required, 3-100 chars)",
  "description": "string (optional, 0-500 chars)",
  "slug": "string (optional)"
}
```

#### Suscripciones
```javascript
{
  "plan": "basic | pro | enterprise (required)",
  "status": "active | pending | cancelled (optional)",
  "startedAt": "ISO date (optional)",
  "expiresAt": "ISO date (optional)",
  "payment": {
    "id": "uuid (required)",
    "amount": "number > 0 (required)",
    "currency": "3-letter code like USD (required)",
    "status": "success | pending | failed (required)",
    "provider": "stripe | paypal (required)",
    "transactionId": "string (required)"
  }
}
```

## 🛠️ Middleware

### 1. Authentication Middleware
```javascript
import { authenticate } from './middleware/authMiddleware.js';

router.get('/protected', authenticate, handler);
```

Verifica JWT en el header `Authorization: Bearer <token>`

### 2. Role Middleware
```javascript
import { authorize } from './middleware/roleMiddleware.js';

router.delete('/:id', authenticate, authorize('admin'), deleteHandler);
```

Verifica que el usuario tenga el rol requerido.

### 3. Validation Middleware
```javascript
import { validateRequest } from './middleware/validationMiddleware.js';
import { createArticleSchema } from './validators/articleValidators.js';

router.post('/', validateRequest(createArticleSchema), createHandler);
```

Valida body, params, query según el esquema Joi.

### 4. Error Handler Middleware
```javascript
// Captura y normaliza errores
app.use(errorHandler);
```

### 5. Security Middleware
- **Helmet:** Headers HTTP de seguridad
- **CORS:** Control de acceso entre orígenes
- **XSS-Clean:** Sanitización de entrada
- **Rate Limiting:** 120 solicitudes por 15 minutos por IP

## ❌ Manejo de Errores

### Respuesta de error estándar:
```json
{
  "status": "error",
  "message": "Descripción del error",
  "details": ["Error 1", "Error 2"],
  "statusCode": 400
}
```

### Códigos de estado HTTP comúnmente usados:
| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

## 🚀 Iniciando el Backend

### 1. Instalación de dependencias
```bash
cd backend
npm install
```

### 2. Configuración del entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Iniciar servidor
```bash
npm start     # Modo producción
npm run dev   # Modo desarrollo con nodemon
```

### 4. Verificar salud
```bash
curl http://localhost:4000/api/health
```

## 📊 Estructura de Base de Datos

Tablas principales:
- **users** - Usuarios del sistema
- **posts** - Artículos/posts
- **categories** - Categorías de posts
- **subscriptions** - Suscripciones de usuarios
- **payments** - Historial de pagos
- **sessions** - Sesiones activas
- **contact_messages** - Mensajes de contacto
- **activity_logs** - Registro de actividad

## 🔒 Seguridad

### Implementado:
✅ Hashing de contraseñas con bcrypt (salt rounds: 10)
✅ JWT tokens con expiración
✅ Rate limiting por IP
✅ Validación de entrada con Joi
✅ Sanitización contra XSS
✅ Headers HTTP seguros con Helmet
✅ CORS configurado para frontend
✅ Logs de actividad
✅ Middleware de autenticación

### Prácticas recomendadas:
- ✅ Usar HTTPS en producción (via Nginx)
- ✅ Guardar JWT_SECRET en variables de entorno
- ✅ NUNCA cambiar la contraseña en la URL
- ✅ Usar parametrización en queries SQL
- ✅ Mantener dependencias actualizadas

## 📚 Ejemplos de uso

### Registrar usuario
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Obtener artículos (público)
```bash
curl http://localhost:4000/api/articles
```

### Crear artículo (admin)
```bash
curl -X POST http://localhost:4000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "title": "Mi Primer Post",
    "description": "Una breve descripción",
    "content": "Contenido del artículo...",
    "category": "Tecnología",
    "status": "published"
  }'
```

## 📖 Variables de Entorno

```bash
# Server
PORT=4000
HOST=localhost
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=jpphub

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Opcionales
LOG_LEVEL=info
```

## 📦 Dependencias principales

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.0",
    "joi": "^17.10.2",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.1",
    "xss-clean": "^0.1.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🐛 Debugging

### Activar logs de debug
```bash
DEBUG=jpphub:* npm start
```

### Logs disponibles
- `jpphub:auth` - Logs de autenticación
- `jpphub:db` - Logs de base de datos
- `jpphub:routes` - Logs de rutas

## 📞 Soporte

Para reportar bugs o solicitar features, crea un issue en el repositorio.
