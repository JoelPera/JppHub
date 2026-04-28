# Guía de Git y Despliegue

Esta guía explica cómo usar Git para subir (push), bajar (pull/clone) repositorios, y cómo funciona el despliegue en GitHub Actions.

## Conceptos Básicos de Git

Git es un sistema de control de versiones que permite rastrear cambios en el código y colaborar con otros.

### Inicializar un Repositorio

Para empezar a usar Git en un proyecto local:

```bash
git init
```

Esto crea un repositorio Git en la carpeta actual.

### Clonar un Repositorio (Descargar)

Para descargar un repositorio existente desde GitHub:

```bash
git clone https://github.com/usuario/nombre-repo.git
```

Esto crea una carpeta con el nombre del repo y descarga todo el contenido.

### Agregar Archivos al Repositorio

Después de hacer cambios, agregar archivos:

```bash
git add .
# o para archivos específicos:
git add archivo.txt
```

### Hacer un Commit (Guardar Cambios)

Guardar los cambios con un mensaje:

```bash
git commit -m "Descripción de los cambios"
```

### Subir Cambios (Push)

Enviar cambios al repositorio remoto (GitHub):

```bash
git push origin main
```

Si es la primera vez, puede necesitar:

```bash
git push -u origin main
```

### Bajar Cambios (Pull)

Actualizar el repositorio local con cambios del remoto:

```bash
git pull origin main
```

### Ver Estado

Ver qué archivos han cambiado:

```bash
git status
```

### Ver Historial

Ver commits anteriores:

```bash
git log
```

## Despliegue con GitHub Actions

Tu proyecto usa GitHub Actions para desplegar automáticamente cuando haces push a la rama `main`.

### Cómo Funciona

1. Cuando haces `git push origin main`, GitHub ejecuta el workflow en `.github/workflows/deploy.yml`.
2. El workflow se conecta a tu VPS via SSH.
3. Baja los últimos cambios con `git pull`.
4. Detiene los contenedores con `docker compose down`.
5. Construye y ejecuta los nuevos contenedores con `docker compose up -d --build`.

### Problemas Comunes y Soluciones

#### 1. Secrets no Configurados
En GitHub, ve a Settings > Secrets and variables > Actions, y agrega:
- `VPS_HOST`: IP o dominio de tu VPS
- `VPS_USER`: Usuario SSH (ej: root o ubuntu)
- `SSH_PRIVATE_KEY`: La clave privada SSH (sin passphrase)

#### 2. Clave SSH no Configurada en VPS
Genera una clave SSH si no tienes:

```bash
ssh-keygen -t rsa -b 4096 -C "tu-email@example.com"
```

Copia la clave pública a tu VPS:

```bash
ssh-copy-id usuario@vps-host
```

O manualmente agrega `~/.ssh/id_rsa.pub` a `~/.ssh/authorized_keys` en el VPS.

#### 3. Permisos de Docker
El usuario SSH debe poder ejecutar Docker. Agrega el usuario al grupo docker:

```bash
sudo usermod -aG docker $USER
```

O usa `sudo` en los comandos de Docker en el workflow.

#### 4. Repositorio no Inicializado en VPS
En tu VPS, clona el repo inicialmente:

```bash
cd /var/www
git clone https://github.com/usuario/JppHub.git JppHub
```

Asegúrate de que el directorio existe y tiene permisos correctos.

#### 5. Comando Docker Compose
Si tu VPS tiene Docker Compose v1, cambia `docker compose` por `docker-compose` en el workflow.

### Depurar el Workflow

Ve a la pestaña "Actions" en GitHub para ver los logs del workflow. Busca errores específicos.

### Mejoras al Workflow

Para mayor robustez, considera agregar manejo de errores y notificaciones.

Recuerda: Siempre prueba localmente antes de push.