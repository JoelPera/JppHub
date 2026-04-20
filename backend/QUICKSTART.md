# 🚀 Quick Start Backend JppHub

## Inicio Rápido

### 1️⃣ Instalar Dependencias

```bash
npm install
```

### 2️⃣ Iniciar el Servidor

```bash
# Modo desarrollo (con auto-recarga)
npm run dev

# O modo producción
npm start
```

El servidor estará disponible en: **http://localhost:4000**

---

## 🧪 Probar Endpoints

### Test: Health Check

```bash
curl http://localhost:4000/api/health
```

### Test: Obtener Artículos

```bash
curl http://localhost:4000/api/articles
```

### Test: Enviar Mensaje de Contacto

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tu Nombre",
    "email": "tu@email.com",
    "message": "Tu mensaje"
  }'
```

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
