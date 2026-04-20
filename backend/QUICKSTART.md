# 🚀 Quick Start - JppHub Backend API

Guía rápida para poner en funcionamiento el backend de JppHub.

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Requisitos Previos
- Node.js v14+ instalado
- MySQL 5.7+ ejecutándose
- `.env` configurado (copiar de `.env.example`)

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno

Crear archivo `.env` en `backend/`:

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
# Asegurar que estos valores coincidan con tu MySQL:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=jpphub

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_clave_secreta_muy_larga_aqui
```

### 4️⃣ Preparar Base de Datos

```bash
# Crear la base de datos y tablas
mysql -u root -p jpphub < DATABASE_SCHEMA.md

# O manualmente:
mysql -u root -p
mysql> CREATE DATABASE jpphub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
mysql> USE jpphub;
mysql> # Ejecutar comandos del archivo DATABASE_SCHEMA.md
```

### 5️⃣ Iniciar el Servidor

```bash
# Modo desarrollo (con auto-recarga)
npm run dev

# O modo producción
npm start
```

✅ Servidor disponible en: **http://localhost:4000**

---

## 📡 Primeros Pasos - Testing

### 1. Health Check

```bash
curl http://localhost:4000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "uptime": 1234,
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected"
}
```

### 2. Registrar Usuario

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Contraseña123!",
    "name": "Tu Nombre"
  }'
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Tu Nombre",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Iniciar Sesión

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Contraseña123!"
  }'
```

Guardar el `token` para los siguientes requests.

### 4. Obtener Artículos (Público)

```bash
curl http://localhost:4000/api/articles
```

### 5. Obtener Perfil (Autenticado)

```bash
curl http://localhost:4000/api/users/me \
  -H "Authorization: Bearer tu_token_aqui"
```

### 6. Enviar Mensaje de Contacto

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tu Nombre",
    "email": "tu@email.com",
    "subject": "Consulta",
    "message": "Tu mensaje aqui"
  }'
```

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren agregar este header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo con token:**
```bash
curl -X GET http://localhost:4000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `POST /api/auth/logout` - Cerrar sesión

### Artículos (admin requiere autenticación)
- `GET /api/articles` - Listar artículos
- `GET /api/articles/:id` - Obtener artículo
- `POST /api/articles` - Crear artículo ⚙️
- `PUT /api/articles/:id` - Actualizar ⚙️
- `DELETE /api/articles/:id` - Eliminar ⚙️

### Suscripciones
- `GET /api/subscriptions` - Obtener suscripción
- `POST /api/subscriptions` - Crear suscripción
- `PATCH /api/subscriptions/cancel` - Cancelar

### Más
- `GET /api/categories` - Listar categorías
- `GET /api/payments` - Listar pagos
- `GET /api/users/me` - Mi perfil
- `GET /api/admin/...` - Panel admin (role: admin)

⚙️ = Requiere autenticación + rol admin

---

## 🛠️ Desarrollo

### Scripts disponibles

```bash
# Iniciar en desarrollo (auto-reload)
npm run dev

# Iniciar en producción
npm start

# Verificar sintaxis
npm run check

# Ver logs detallados
DEBUG=jpphub:* npm start
```

### Estructura del proyecto

```
backend/
├── controllers/      # Manejadores de requests
├── services/         # Lógica de negocio
├── repositories/     # Acceso a datos
├── middleware/       # Autenticación, validación
├── validators/       # Esquemas Joi
├── routes/           # Definición de endpoints
├── database/         # Configuración MySQL
├── config/           # Variables de entorno
└── server.js         # Archivo principal
```

---

## ❓ Troubleshooting

### Error: "Cannot find module"
```bash
# Solución: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Connection refused" (MySQL)
```bash
# Verificar que MySQL está ejecutándose
# En Windows: Services > MySQL80
# En Mac: brew services start mysql
# En Linux: sudo systemctl start mysql
```

### Error: "JWT expired"
```bash
# Hacer login de nuevo para obtener nuevo token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"...","password":"..."}'
```

### Error: "Database not found"
```bash
# Crear base de datos desde script
mysql -u root -p < DATABASE_SCHEMA.md
```

---

## 📚 Documentación Completa

Para documentación detallada, ver: **[BACKEND.md](./BACKEND.md)**

- Flow de autenticación
- Matrix de permisos
- Estructura de base de datos
- Ejemplos avanzados
- Manejo de errores

---

## 🚀 Próximos Pasos

1. ✅ Backend corriendo
2. 📝 Crear artículos en admin
3. 💳 Configurar suscripciones
4. 🔗 Conectar frontend
5. 🐳 Deployar con Docker

---

**¿Problemas?** Revisar logs en consola o consultar [BACKEND.md](./BACKEND.md)

---

## 📚 Documentación Completa

Para documentación detallada, consulta `BACKEND.md`

```bash
cat BACKEND.md
```

---

## ⚡ Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| `Cannot find module` | `npm install` |
| `PORT already in use` | Cambiar `PORT` en `.env` |
| `CORS error` | Verificar `FRONTEND_URL` en `.env` |
| `Datos se pierden` | Integrar base de datos |

---

## 📝 Endpoints Disponibles

```
GET  /api/health              → Estado del servidor
GET  /api/articles            → Obtener artículos
POST /api/articles            → Crear artículo
GET  /api/articles/:id        → Obtener artículo
PUT  /api/articles/:id        → Actualizar artículo
DELETE /api/articles/:id      → Eliminar artículo

POST /api/contact             → Enviar mensaje
GET  /api/contact             → Obtener mensajes
GET  /api/contact/:id         → Obtener mensaje
```

---

## 🔐 Configuración (.env)

Editar `.env` para cambiar:
- `PORT` - Puerto del servidor (por defecto: 4000)
- `HOST` - Host (por defecto: 0.0.0.0)
- `FRONTEND_URL` - URL del frontend (por defecto: http://localhost:3000)
- `NODE_ENV` - Entorno (development o production)

---

¡Listo! Tu backend está funcionando. 🎉
