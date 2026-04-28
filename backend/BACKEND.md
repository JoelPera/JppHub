# 🚀 Backend JppHub - Guía Completa

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Endpoints API](#endpoints-api)
7. [Cambios Necesarios](#cambios-necesarios)
8. [Integración de Base de Datos](#integración-de-base-de-datos)
9. [Troubleshooting](#troubleshooting)

---

## 📖 Descripción General

Este es el backend de **JppHub**, una plataforma educativa sobre IA y automatización. 

**Stack Tecnológico:**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Para comunicación con frontend
- **UUID** - Para generar IDs únicos
- **dotenv** - Para variables de entorno

**Estado Actual:**
- ✅ Backend funcional sin base de datos
- ✅ Datos almacenados en memoria (se pierden al reiniciar)
- ⏳ Listo para integrar base de datos
- ⏳ Listo para agregar autenticación

---

## 🏗️ Arquitectura

El proyecto sigue el patrón **MVC** (Model-View-Controller):

```
┌─────────────────────────────────────────┐
│         CLIENT (FRONTEND)               │
└────────────┬────────────────────────────┘
             │ HTTP/REST
             ↓
┌─────────────────────────────────────────┐
│    ROUTES (Definen los endpoints)       │
│    /api/articles, /api/contact, etc     │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  CONTROLLERS (Manejan las solicitudes)  │
│  - ArticleController                    │
│  - ContactController                    │
│  - HealthController                     │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│   SERVICES (Lógica de negocio)          │
│  - ArticleService                       │
│  - ContactService                       │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│   DATA (Base de datos o memoria)        │
│   - articles (array en memoria)         │
│   - contactMessages (array en memoria)  │
└─────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
backend/
├── server.js                  # Archivo principal (punto de entrada)
├── package.json               # Dependencias del proyecto
├── .env.example               # Archivo de ejemplo de variables
├── .gitignore                 # Archivos a ignorar en Git
│
├── config/
│   └── config.js              # Configuración centralizada
│
├── controllers/               # Controladores (lógica de solicitudes)
│   ├── articleController.js   # Maneja solicitudes de artículos
│   ├── contactController.js   # Maneja solicitudes de contacto
│   └── healthController.js    # Maneja verificación de salud
│
├── routes/                    # Definición de rutas API
│   ├── articleRoutes.js       # Rutas para /api/articles
│   ├── contactRoutes.js       # Rutas para /api/contact
│   └── healthRoutes.js        # Rutas para /api/health
│
├── services/                  # Servicios (lógica de negocio)
│   ├── articleService.js      # Lógica de artículos
│   └── contactService.js      # Lógica de contacto
│
├── middleware/                # Middleware (procesamiento de solicitudes)
│   ├── requestLogger.js       # Registra todas las solicitudes
│   ├── errorHandler.js        # Maneja errores globales
│   └── validationMiddleware.js # Valida datos
│
└── utils/                     # Utilidades
    └── (Aquí irán funciones auxiliares)
```

---

## 🔧 Instalación

### Paso 1: Instalar Node.js

```bash
# Verificar si Node.js está instalado
node --version

# Si no está instalado, descargarlo desde:
# https://nodejs.org/
```

### Paso 2: Instalar Dependencias

```bash
# Ir a la carpeta backend
cd backend

# Instalar las dependencias
npm install
```

### Paso 3: Crear archivo .env

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# El archivo .env ya tiene valores por defecto, pero puedes editarlo
nano .env  # O usar tu editor favorito
```

### Paso 4: Ejecutar el servidor

```bash
# Modo desarrollo (con auto-recarga)
npm run dev

# Modo producción
npm start
```

El servidor debería iniciarse en `http://localhost:4000`

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Puerto donde corre el servidor
PORT=4000

# Host (0.0.0.0 = accesible desde cualquier IP)
HOST=0.0.0.0

# Entorno (development o production)
NODE_ENV=development

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

### Modificar Configuración

1. **Cambiar puerto:**
   ```env
   PORT=5000
   ```

2. **Cambiar host:**
   ```env
   HOST=localhost  # Solo accesible localmente
   ```

3. **Entorno de producción:**
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://tudominio.com
   ```

---

## 🔌 Endpoints API

### Health Check

```bash
GET /api/health
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Servidor funcionando correctamente",
  "server": {
    "uptime": "125 segundos",
    "memory": {
      "heapUsed": "42 MB",
      "heapTotal": "128 MB"
    },
    "environment": "development",
    "timestamp": "2026-04-20T10:30:00.000Z"
  }
}
```

---

### Artículos

#### Obtener todos los artículos

```bash
GET /api/articles
```

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Qué es la IA en 2026",
      "description": "Una guía clara...",
      "content": "La inteligencia artificial...",
      "category": "IA",
      "author": "JppHub Team",
      "createdAt": "2026-04-01T00:00:00.000Z",
      "updatedAt": "2026-04-01T00:00:00.000Z"
    }
  ],
  "count": 3
}
```

#### Obtener un artículo específico

```bash
GET /api/articles/550e8400-e29b-41d4-a716-446655440000
```

#### Crear un nuevo artículo

```bash
POST /api/articles
Content-Type: application/json

{
  "title": "Mi nuevo artículo",
  "description": "Descripción breve",
  "content": "Contenido completo del artículo",
  "category": "Automatización",
  "author": "Tu nombre"
}
```

#### Actualizar un artículo

```bash
PUT /api/articles/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "title": "Título actualizado",
  "content": "Contenido actualizado"
}
```

#### Eliminar un artículo

```bash
DELETE /api/articles/550e8400-e29b-41d4-a716-446655440000
```

---

### Contacto

#### Enviar mensaje de contacto

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "message": "Me gustaría más información sobre..."
}
```

**Respuesta (201 Created):**
```json
{
  "status": "success",
  "message": "Mensaje enviado exitosamente. Te contactaremos pronto.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "message": "Me gustaría más información sobre...",
    "read": false,
    "createdAt": "2026-04-20T10:30:00.000Z"
  }
}
```

#### Obtener todos los mensajes

```bash
GET /api/contact
```

#### Obtener un mensaje específico

```bash
GET /api/contact/550e8400-e29b-41d4-a716-446655440001
```

---

## 🔄 Cambios Necesarios para Funcionar

### 1️⃣ Conectar con el Frontend

Tu frontend debe hacer solicitudes HTTP al backend:

```javascript
// Ejemplo en JavaScript (main.js)

// Obtener artículos
const articulos = await fetch('http://localhost:4000/api/articles')
  .then(res => res.json());

// Enviar mensaje de contacto
const response = await fetch('http://localhost:4000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Tu nombre',
    email: 'tu@email.com',
    message: 'Tu mensaje'
  })
});
```

### 2️⃣ Integrar una Base de Datos

**Actualmente:**
- Los datos se guardan en memoria (arrays)
- Se pierden cuando reinician el servidor

**Para agregar base de datos:**

**Opción A: MongoDB + Mongoose**

```bash
npm install mongoose
```

```javascript
// En config/config.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
};
```

**Opción B: PostgreSQL + Sequelize**

```bash
npm install sequelize pg pg-hstore
```

**Opción C: MySQL**

```bash
npm install mysql2
```

### 3️⃣ Agregar Autenticación

```bash
npm install bcryptjs jsonwebtoken
```

```javascript
// Crear middleware de autenticación
// middleware/auth.js

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### 4️⃣ Agregar Validaciones Mejoradas

```bash
npm install joi
```

```javascript
// validators/articleValidator.js
import Joi from 'joi';

export const articleSchema = Joi.object({
  title: Joi.string().required().min(5).max(200),
  description: Joi.string().required().min(10).max(500),
  content: Joi.string().required().min(50),
  category: Joi.string().default('General'),
  author: Joi.string().default('Admin')
});
```

### 5️⃣ Enviar Emails

```bash
npm install nodemailer
```

```javascript
// services/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};
```

---

## 💾 Integración de Base de Datos

### Paso a Paso para MongoDB

```bash
# 1. Instalar Mongoose
npm install mongoose

# 2. Crear un esquema
# models/Article.js
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  author: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Article = mongoose.model('Article', articleSchema);

# 3. Actualizar el servicio
# services/articleService.js
import { Article } from '../models/Article.js';

export class ArticleService {
  static async getAllArticles() {
    return await Article.find();
  }
  
  static async createArticle(data) {
    const article = new Article(data);
    return await article.save();
  }
  // ... resto de métodos
}

# 4. Conectar en server.js
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🐛 Troubleshooting

### ❌ Error: Cannot find module 'express'

```bash
# Solución: instalar dependencias
npm install
```

### ❌ Error: PORT already in use

```bash
# Cambiar el puerto en .env
PORT=5000  # O cualquier puerto disponible
```

### ❌ Error: CORS error

```bash
# Asegúrate de que FRONTEND_URL sea correcto en .env
FRONTEND_URL=http://localhost:3000
```

### ❌ Datos se pierden después de reiniciar

```bash
# Esto es normal sin base de datos.
# Solución: integrar una base de datos (ver sección anterior)
```

### ❌ No puedo acceder desde otra máquina

```bash
# Cambiar en .env
HOST=0.0.0.0  # En lugar de localhost
```

---

## 📝 Próximos Pasos

1. **Integrar Base de Datos** (MongoDB/PostgreSQL)
2. **Agregar Autenticación** (JWT)
3. **Implementar Validaciones** (Joi)
4. **Enviar Emails** (Nodemailer)
5. **Agregar Tests** (Jest/Mocha)
6. **Deployar a Producción** (Heroku/DigitalOcean)

---

## 📚 Recursos Útiles

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design](https://restfulapi.net/)

---

**Última actualización:** 20 de abril de 2026
**Versión:** 1.0.0
