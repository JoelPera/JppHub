# Proyecto JPPHub\n\n## Frontend\nEl frontend es la parte del software con la que los usuarios interactúan directamente. Incluye el diseño visual, las interfaces de usuario y la experiencia del usuario que se presentan en el navegador web. Los elementos comunes del frontend son archivos HTML, CSS y JavaScript que controlan el diseño, el estilo y la interactividad, respectivamente.
\n\n## Backend\nEl backend es la parte del software que maneja la lógica del servidor, la base de datos y la comunicación entre los usuarios y la infraestructura del servidor. Se encarga de las operaciones que ocurren entre bambalinas, incluyendo la autenticación, el almacenamiento y la gestión de datos. El backend está compuesto por scripts del servidor, API y gestión de bases de datos.
\n\n## Estructura de Carpetas\n\nEl proyecto está organizado en la siguiente estructura de carpetas:\n\n- **admin/**: Archivos relacionados con la administración.\n  - index.html\n- **articles/**: Contiene artículos o contenido estático.\n  - articulo-1.html\n- **backend/**: Lógica del servidor y scripts de backend.\n  - controllers\n  - routes\n  - services\n- **frontend/**: Archivos que constituyen la interfaz de usuario.\n  - assets\n  - css\n    - style.css\n  - js\n    - admin.js\n    - main.js\n  - index.html
\n\n## Iniciar Backend\nPara iniciar el backend del proyecto, asegúrate de tener todas las dependencias instaladas y ejecuta el siguiente comando desde el directorio \:\n\n```bash\nnpm start\n```\n\n## Puertos Usados\n- **Frontend**: Generalmente se ejecuta en el puerto 3000.\n- **Backend**: Normalmente opera en el puerto 5000, a menos que esté configurado de otra manera.\n\nAsegúrate de que estos puertos estén disponibles y no bloqueados por el firewall.
\n\n## Iniciar Backend\nPara iniciar el backend del proyecto, asegúrate de tener todas las dependencias instaladas y ejecuta el siguiente comando desde el directorio 'backend':\n\n```bash\nnpm start\n```\n\n## Puertos Usados\n- **Frontend**: Generalmente se ejecuta en el puerto 3000.\n- **Backend**: Normalmente opera en el puerto 5000, a menos que esté configurado de otra manera.\n\nAsegúrate de que estos puertos estén disponibles y no bloqueados por el firewall.

## Nuevas Instrucciones

Aquí van las instrucciones adicionales que deseas añadir.

## Puerto Usado

El backend del proyecto utiliza el siguiente puerto:

- **Puerto 3000:** Este es el puerto por defecto utilizado por el servidor de desarrollo. Puedes acceder al backend a través de `http://localhost:3000`.

Si necesitas cambiar el puerto, asegúrate de actualizar la configuración en los archivos correspondientes, como los archivos de entorno `.env`.

## Cómo Reiniciar Nginx

Para reiniciar el servidor web Nginx, sigue estos pasos:

1. **Accede a tu servidor** a través de la terminal o SSH, si es necesario.

2. **Ejecuta el siguiente comando** para reiniciar Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

3. **Verifica que Nginx está funcionando correctamente** después del reinicio:
   ```bash
   sudo systemctl status nginx
   ```

   El estado debe indicar que el servicio Nginx está activo y funcionando.

Si encuentras problemas al reiniciar, revisa los logs de Nginx ubicados típicamente en `/var/log/nginx/error.log`.

## Rutas Importantes del Proyecto

Aquí hay un listado de las rutas importantes dentro de este proyecto:

- **Directorio de Configuración:** `/var/www/jpphub/config` - Contiene los archivos de configuración esenciales para el backend.
- **Directorio de Logs:** `/var/log/nginx` - Localización de los logs de Nginx para verificar errores y accesos.
- **Directorio de Scripts:** `/var/www/jpphub/scripts` - Scripts útiles para la administración y el mantenimiento del servidor.
- **Directorio de Documentos:** `/var/www/jpphub/docs` - Documentación adicional sobre el proyecto y sus dependencias.

Estas rutas son críticas para el funcionamiento y mantenimiento adecuado del sistema.
