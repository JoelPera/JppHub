# JppHub 🚀

**Plataforma de crecimiento profesional en IA y Automatización**

JppHub es una plataforma web moderna diseñada para enseñar y compartir conocimientos sobre Inteligencia Artificial, automatización y desarrollo profesional. El proyecto incluye recursos, guías, y flujos prácticos para optimizar tu trabajo y crear soluciones inteligentes.

---

## 📋 Descripción General

Este proyecto está estructurado con una arquitectura moderna que separa completamente el frontend del backend:

- **Frontend**: Una interfaz de usuario moderna y responsiva construida con HTML, CSS y JavaScript
- **Backend**: Lógica del servidor, APIs y gestión de base de datos (Node.js/Express)
- **Infraestructura**: Containerización con Docker y Nginx como servidor web

---

## 📁 Estructura del Proyecto

```
JppHub/
├── frontend/                    # Interfaz de usuario
│   ├── index.html              # Página principal
│   ├── css/
│   │   └── style.css           # Estilos profesionales
│   ├── js/
│   │   ├── main.js             # JavaScript principal
│   │   └── admin.js            # Funcionalidades de administración
│   └── articles/               # Contenido de artículos
│       └── articulo-1.html
├── backend/                    # Lógica del servidor
│   ├── controllers/            # Controladores de rutas
│   ├── routes/                 # Definición de rutas API
│   └── services/               # Servicios y lógica de negocio
├── admin/                      # Panel de administración
│   └── index.html
├── nginx/                      # Configuración de servidor web
│   ├── default.conf
│   └── site.conf
├── docker/                     # Archivos de containerización
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── Dockerfile.ignore
├── docker-compose.yml          # Configuración de contenedores
├── package.json                # Dependencias del proyecto
└── README.md                   # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Servidor Web**: Nginx
- **Containerización**: Docker & Docker Compose
- **Control de Versiones**: Git

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Docker y Docker Compose instalados
- Node.js v14+ (para desarrollo local)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <URL-del-repositorio>
   cd JppHub-main
   ```

2. **Instalar dependencias (opcional, si ejecutas localmente)**
   ```bash
   npm install
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`
   - Nginx: `http://localhost:8080`

---

## 🚀 Puertos Utilizados

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 3000 | Servidor de desarrollo del frontend |
| Backend | 4000 | API del servidor |
| Nginx | 8080 | Servidor web principal |

---

## 💻 Desarrollo Local

### Ejecutar Frontend Localmente
```bash
cd frontend
python3 -m http.server 8000
```
Accede a `http://localhost:8000`

### Ejecutar Backend Localmente
```bash
cd backend
npm install
npm start
```

### Variables de Entorno Backend
Crear archivo `backend/.env`:
```bash
PORT=4000
HOST=localhost
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=jpphub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

---
## Cambios Recientes

### Actualización Completa del Backend SaaS (v1.1)

La arquitectura backend ha sido completamente refactorizado a nivel de producción con soporte completo para aplicaciones SaaS:

#### ✨ Nuevas Características:

1. **Sistema de Autenticación Robusto**
   - JWT tokens con validación en cada request
   - Hash de contraseñas con bcrypt
   - Roles y permisos (admin, user, premium)
   - Refresh tokens y logout seguro

2. **Arquitectura en Capas**
   - **Routes**: Definición de endpoints HTTP
   - **Controllers**: Manejadores de solicitudes
   - **Services**: Lógica de negocio
   - **Repositories**: Acceso a datos MySQL
   - **Validators**: Esquemas Joi para validación
   - **Middleware**: Autenticación, roles, validación, manejo de errores

3. **Gestión de Usuarios**
   - Registro y login seguro
   - Perfiles de usuario
   - Historial de actividad
   - Administración de sesiones

4. **Sistema de Contenido**
   - Artículos/Posts con estados (draft, published)
   - Categorías configurables
   - Contador de vistas
   - Gestión de autor y metadata

5. **Sistema de Suscripciones y Pagos**
   - Planes: basic, pro, enterprise
   - Integración con proveedores de pago (stripe, paypal)
   - Historial completo de pagos
   - Gestión de suscripciones

6. **Panel de Administración**
   - API endpoints para gestionar usuarios
   - Visualización de suscripciones y pagos
   - Logs de actividad del sistema
   - Estadísticas y reportes

7. **Seguridad de Producción**
   - Helmet para headers HTTP seguros
   - Rate limiting (120 req/15min por IP)
   - CORS configurable
   - Sanitización contra XSS
   - Validación de entrada robusta
   - Parametrización de queries SQL

#### 📡 Nuevos Endpoints API:

```
POST   /api/auth/register          # Registrar usuario
POST   /api/auth/login             # Iniciar sesión
POST   /api/auth/refresh           # Refrescar token
POST   /api/auth/logout            # Cerrar sesión

GET    /api/articles               # Listar artículos
POST   /api/articles               # Crear artículo (admin)
GET    /api/articles/:id           # Obtener artículo
PATCH  /api/articles/:id/views     # Incrementar vistas
PUT    /api/articles/:id           # Actualizar artículo (admin)
DELETE /api/articles/:id           # Eliminar artículo (admin)

GET    /api/categories             # Listar categorías
POST   /api/categories             # Crear categoría (admin)
PUT    /api/categories/:id         # Actualizar categoría (admin)
DELETE /api/categories/:id         # Eliminar categoría (admin)

GET    /api/subscriptions          # Obtener suscripción (auth)
POST   /api/subscriptions          # Crear suscripción (auth)
PATCH  /api/subscriptions/cancel   # Cancelar suscripción (auth)

GET    /api/payments               # Listar pagos (auth)
POST   /api/payments               # Crear pago (auth)

GET    /api/users/me               # Perfil del usuario (auth)
GET    /api/users                  # Listar usuarios (admin)

GET    /api/admin/users            # Admin: usuarios
GET    /api/admin/subscriptions    # Admin: suscripciones
GET    /api/admin/payments         # Admin: pagos
GET    /api/admin/activity         # Admin: actividad

GET    /api/health                 # Health check
```

#### 📊 Estructura de Base de Datos:

Se requieren las siguientes tablas MySQL:
- `users` - Usuarios del sistema
- `posts` - Artículos y contenido
- `categories` - Categorías de posts
- `subscriptions` - Datos de suscripción por usuario
- `payments` - Historial de transacciones
- `sessions` - Sesiones activas
- `contact_messages` - Mensajes de contacto
- `activity_logs` - Registro de actividad del sistema

#### 🔧 Configuración del Backend:

**Archivo `.env.example` (copiar a `.env`):**
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
DB_PASSWORD=tu_contraseña
DB_NAME=jpphub

# JWT
JWT_SECRET=tu_clave_secreta_super_larga
JWT_EXPIRE=7d
```

#### 📖 Documentación Completa:

Para documentación detallada del backend con ejemplos de uso, flow de autenticación, matrix de permisos, y más:

→ **Ver [BACKEND.md](./BACKEND.md)**

#### 🚀 Iniciar Backend:

```bash
cd backend
npm install
npm start              # Producción
npm run dev            # Desarrollo con nodemon
```

Verificar: `curl http://localhost:4000/api/health`

#### ✅ Cambios de versión anterior:

- ✅ Conexión MySQL completamente integrada
- ✅ API REST con estructura profesional
- ✅ Autenticación JWT con roles
- ✅ Validación robusta Joi
- ✅ Middleware de seguridad
- ✅ Manejo de errores centralizado
- ✅ Logging de actividad
- ✅ Rate limiting y protección contra abuso
- ✅ Documentación API completa
---

## 🎨 Frontend - Interfaz de Usuario SaaS

### ✨ Características Implementadas

La interfaz frontend ha sido completamente transformada en una aplicación SaaS funcional con:

#### 🔐 Sistema de Autenticación Completo
- **Login/Registro**: Formularios seguros conectados al backend
- **JWT Storage**: Tokens almacenados en localStorage
- **Estado Global**: Gestión de autenticación en toda la app
- **Protección de Rutas**: Redirección automática para usuarios no autenticados
- **Logout Seguro**: Limpieza completa de sesión

#### 🏠 Páginas y Navegación
- **Página Principal**: Landing page moderna con artículos destacados
- **Login/Register**: Páginas dedicadas con validación en tiempo real
- **Dashboard Usuario**: Panel personal con información del perfil y artículos recientes
- **Panel Admin**: Interfaz completa para gestión del sistema (solo admin)
- **Vista de Artículos**: Página individual para leer contenido completo

#### 🎯 Dashboard de Usuario
- Información del perfil (nombre, email, rol, suscripción)
- Estado de suscripción (Free/Premium/Admin)
- Lista de artículos recientes con contador de vistas
- Navegación intuitiva al panel admin (si aplica)

#### 👑 Panel de Administración
- **Gestión de Usuarios**: Lista completa con roles y fechas de registro
- **Artículos**: Visualización de contenido publicado con estadísticas
- **Pagos**: Historial de transacciones y estados
- **Actividad**: Logs del sistema para auditoría
- **Estadísticas**: Conteos y métricas en tiempo real

#### 📱 Diseño y UX
- **Responsive**: Funciona en desktop, tablet y móvil
- **Tema Oscuro**: Diseño moderno con gradientes y efectos sutiles
- **Loading States**: Indicadores de carga en todas las operaciones
- **Error Handling**: Mensajes de error amigables
- **Navegación Inteligente**: Navbar que cambia según estado de autenticación

#### 🔌 Integración con Backend
- **API Client**: Capa reusable para todas las llamadas HTTP
- **Auto-auth**: Headers Authorization automáticos en requests
- **Error Handling**: Gestión centralizada de errores de red
- **Data Fetching**: Carga asíncrona con fallbacks

### 📁 Estructura de Archivos Frontend

```
frontend/
├── index.html                 # Página principal con artículos
├── css/
│   └── style.css             # Estilos globales modernos
├── js/
│   └── main.js               # Lógica principal y carga de artículos
├── utils/
│   ├── api.js                # Cliente API para backend
│   └── auth.js               # Gestión de autenticación
├── pages/
│   ├── login.html            # Página de inicio de sesión
│   ├── register.html         # Página de registro
│   ├── dashboard.html        # Dashboard de usuario
│   └── admin.html            # Panel de administración
└── articles/
    └── article.html           # Vista individual de artículo
```

### 🚀 Cómo Funciona la Autenticación

#### Flujo de Login:
1. Usuario ingresa email/contraseña en `pages/login.html`
2. Frontend envía POST a `/api/auth/login`
3. Backend valida credenciales y retorna JWT + datos de usuario
4. Token se guarda en localStorage
5. Usuario es redirigido a `pages/dashboard.html`

#### Estado de Autenticación:
- **Verificación**: Al cargar cualquier página, se checkea token en localStorage
- **Decoding**: JWT se decodifica para obtener info del usuario
- **Protección**: Páginas protegidas redirigen a login si no hay token válido
- **Navbar**: Se actualiza dinámicamente según estado de login

#### Roles y Permisos:
- **Usuario Regular**: Acceso a dashboard y artículos
- **Usuario Premium**: Beneficios adicionales (preparado para futuras features)
- **Admin**: Acceso completo al panel de administración

### 🎨 Diseño y Estilos

- **Framework CSS**: Variables CSS personalizadas para consistencia
- **Colores**: Tema oscuro profesional con acentos en azul (#6366f1)
- **Tipografía**: Inter font para legibilidad moderna
- **Componentes**: Cards, botones, forms reutilizables
- **Responsive**: Media queries para todos los tamaños de pantalla

### 🔧 API Integration

#### Cliente API (`utils/api.js`):
```javascript
// Ejemplo de uso
const articles = await api.getArticles({ limit: 10 });
const user = await api.getCurrentUser();
await api.login(email, password);
```

#### Endpoints Conectados:
- `/api/auth/*` - Autenticación completa
- `/api/articles` - CRUD de artículos
- `/api/users` - Gestión de usuarios
- `/api/admin/*` - Funciones administrativas

### 📱 Responsive Design

- **Mobile First**: Optimizado para móviles, escala a desktop
- **Breakpoints**: 768px para tablets, 1200px para desktop
- **Navegación**: Navbar colapsable en móviles
- **Grids**: Layouts flexibles que se adaptan al tamaño

### 🚀 Inicio Rápido Frontend

1. **Servir archivos estáticos**:
   ```bash
   cd frontend
   python3 -m http.server 3000
   ```

2. **Acceder**: `http://localhost:3000`

3. **Backend debe estar corriendo** en `http://localhost:4000`

### 🔄 Estados de la Aplicación

- **No autenticado**: Solo puede ver landing page y artículos públicos
- **Usuario autenticado**: Acceso a dashboard y perfil
- **Admin**: Acceso completo a panel de administración
- **Loading**: Estados de carga en todas las operaciones async
- **Error**: Manejo de errores con mensajes amigables

### 🎯 Próximos Pasos

- [ ] Integración con base de datos real
- [ ] Sistema de pagos (Stripe/PayPal)
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda y filtros avanzados
- [ ] Editor de artículos WYSIWYG
- [ ] Sistema de comentarios

---

## 📤 Subir Cambios a GitHub

**Comandos para recordar cómo subir el código:**

```bash
git add .
git commit -m "update"
git pull origin main --rebase
git push origin main
```

### Explicación detallada:

1. **`git add .`** - Agrega todos los cambios al área de preparación
2. **`git commit -m "update"`** - Crea un commit local con los cambios
3. **`git pull origin main --rebase`** - Obtiene los últimos cambios del repositorio remoto
4. **`git push origin main`** - Sube tus cambios a GitHub

### Flujo completo recomendado:

```bash
# 1. Ver el estado actual
git status

# 2. Preparar cambios
git add .

# 3. Crear el commit
git commit -m "update"

# 4. Sincronizar con el remoto
git pull origin main --rebase

# 5. Subir los cambios
git push origin main

# 6. Confirmar que se subió correctamente
git log --oneline -5
```

---

## 🔧 Reiniciar Servicios

### Reiniciar Docker Compose
```bash
docker-compose restart
```

### Reiniciar Nginx (si ejecutas en el servidor)
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 📝 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `docker-compose up --build` | Construir e iniciar todos los servicios |
| `docker-compose down` | Detener todos los servicios |
| `docker-compose logs` | Ver logs de los servicios |
| `git status` | Ver estado actual del repositorio |
| `git log` | Ver historial de cambios |
| `git diff` | Ver cambios sin commitar |
| `git reset HEAD~1` | Deshacer el último commit (pero mantiene cambios) |

---

## 📂 Rutas Importantes en Producción

- **Configuración**: `/var/www/jpphub/config`
- **Logs de Nginx**: `/var/log/nginx`
- **Scripts**: `/var/www/jpphub/scripts`
- **Documentación**: `/var/www/jpphub/docs`

---

## ✨ Características Principales

✅ Diseño profesional y responsivo
✅ Plataforma educativa sobre IA y automatización
✅ Contenido sobre herramientas como ChatGPT, n8n
✅ Formulario de contacto funcional
✅ Blog con últimos artículos
✅ Sección de automatización inteligente
✅ Infraestructura containerizada

---

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📧 Contacto y Soporte

Para consultas, sugerencias o reportar problemas, puedes:
- Usar el formulario de contacto en la web
- Abrir un issue en GitHub
- Revisar la documentación en `/docs`

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo LICENSE para más detalles.

---

**Última actualización**: 20 de abril de 2026
**Versión**: 1.0.0
