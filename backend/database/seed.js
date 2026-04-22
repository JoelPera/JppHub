// Seed idempotente del usuario admin y algunos datos demo
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from './db.js';

const ADMIN_EMAIL = 'admin@jpphub.com';
const ADMIN_PASSWORD = 'Admin123!';

export async function seedAdmin() {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [ADMIN_EMAIL]);
    if (rows.length) {
        console.log('[seed] admin ya existe:', ADMIN_EMAIL);
        return;
    }
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const adminId = uuidv4();
    await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, provider, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'admin', 'local', NOW(), NOW())`,
        [adminId, 'Administrador', ADMIN_EMAIL, passwordHash]
    );
    console.log('[seed] admin creado:', ADMIN_EMAIL, '(pwd: Admin123!)');

    // Un autor demo
    const authorId = uuidv4();
    const authorPwd = await bcrypt.hash('Autor123!', 12);
    await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, provider, created_at, updated_at)
         VALUES (?, 'Autor Demo', 'autor@jpphub.com', ?, 'user', 'local', NOW(), NOW())`,
        [authorId, authorPwd]
    );
    console.log('[seed] autor demo creado: autor@jpphub.com (pwd: Autor123!)');

    // Un artículo aprobado y uno pendiente, para que la web tenga contenido
    await pool.query(
        `INSERT INTO posts (id, title, slug, description, content, category, author, author_id, status, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', NOW(), NOW(), NOW())`,
        [uuidv4(),
         'El impacto de la IA en los negocios 2026',
         'el-impacto-de-la-ia-en-los-negocios-2026',
         'Cómo la inteligencia artificial está transformando cada industria en 2026.',
         'La inteligencia artificial ha dejado de ser una promesa futurista para convertirse en una herramienta transversal a cualquier industria...',
         'Inteligencia Artificial',
         'Autor Demo',
         authorId]
    );
    await pool.query(
        `INSERT INTO posts (id, title, slug, description, content, category, author, author_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [uuidv4(),
         'Automatiza tu negocio con n8n en 7 pasos',
         'automatiza-tu-negocio-con-n8n-en-7-pasos',
         'Una guía práctica para configurar flujos de trabajo con n8n desde cero.',
         'n8n es una plataforma open-source que permite automatizar tareas entre cientos de servicios sin escribir código...',
         'Automatización',
         'Autor Demo',
         authorId]
    );
    console.log('[seed] artículos demo creados.');
}

export default seedAdmin;
