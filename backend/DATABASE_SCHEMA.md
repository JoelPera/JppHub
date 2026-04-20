# JppHub Backend - Schema MySQL

Este archivo contiene el esquema necesario para la base de datos MySQL de JppHub.

## Crear Base de Datos

```sql
CREATE DATABASE IF NOT EXISTS jpphub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jpphub;
```

## Tablas del Sistema

### 1. Usuarios (users)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'premium') DEFAULT 'user',
    avatar_url VARCHAR(500),
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Posts/Artículos (posts)
```sql
CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(500),
    content LONGTEXT,
    category VARCHAR(100),
    author VARCHAR(255),
    views INT DEFAULT 0,
    status ENUM('draft', 'published') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at),
    FULLTEXT INDEX ft_search (title, description, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Categorías (categories)
```sql
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. Suscripciones (subscriptions)
```sql
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan ENUM('basic', 'pro', 'enterprise') NOT NULL,
    status ENUM('active', 'pending', 'cancelled', 'expired') DEFAULT 'pending',
    started_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. Pagos (payments)
```sql
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subscription_id VARCHAR(36),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('success', 'pending', 'failed', 'refunded') DEFAULT 'pending',
    provider VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. Sesiones (sessions)
```sql
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. Mensajes de Contacto (contact_messages)
```sql
CREATE TABLE contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message LONGTEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    responded_at TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 8. Logs de Actividad (activity_logs)
```sql
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Insertar Datos de Ejemplo

### Categorías de ejemplo
```sql
INSERT INTO categories (id, name, slug, description) VALUES
('cat-1', 'Inteligencia Artificial', 'ia', 'Artículos sobre IA y Machine Learning'),
('cat-2', 'Automatización', 'automatizacion', 'Guías de automatización de procesos'),
('cat-3', 'Desarrollo', 'desarrollo', 'Tutoriales de programación y desarrollo'),
('cat-4', 'Productividad', 'productividad', 'Consejos para aumentar productividad');
```

### Usuario Admin de ejemplo
```sql
-- Contraseña: Admin123! (debe ser hasheada con bcrypt antes de insertar)
INSERT INTO users (id, email, name, password_hash, role) VALUES
('user-admin', 'admin@jpphub.com', 'Administrador', '$2b$10$...', 'admin');
```

## Índices para Optimización

Los índices anteriores optimizan búsquedas comunes. Para mejor rendimiento:

```sql
-- Analizar tablas para optimizar queries
ANALYZE TABLE users;
ANALYZE TABLE posts;
ANALYZE TABLE subscriptions;
ANALYZE TABLE payments;
ANALYZE TABLE activity_logs;
```

## Backup y Restore

### Hacer backup
```bash
mysqldump -u root -p jpphub > jpphub_backup.sql
```

### Restaurar desde backup
```bash
mysql -u root -p jpphub < jpphub_backup.sql
```

## Notas de Seguridad

- ✅ Las contraseñas se almacenan como hash con bcrypt (nunca en texto plano)
- ✅ Los IDs son UUIDs v4 (más seguros que IDs secuenciales)
- ✅ Se usan transacciones para operaciones críticas
- ✅ Los índices mejoran rendimiento sin comprometer seguridad
- ✅ Las claves foráneas garantizan integridad referencial

## Mantenimiento

### Verificar integridad
```sql
CHECK TABLE users, posts, subscriptions, payments;
```

### Optimizar tablas
```sql
OPTIMIZE TABLE users;
OPTIMIZE TABLE posts;
OPTIMIZE TABLE subscriptions;
```

### Limpiar sesiones expiradas (ejecutar periódicamente)
```sql
DELETE FROM sessions WHERE expires_at < NOW();
DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```
