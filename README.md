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
