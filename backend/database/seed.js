import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import pool from "./db.js";

const ADMIN_EMAIL = "admin@jpphub.com";
const ADMIN_PASSWORD = "Admin123!";

export async function seedAdmin() {
    try {
        // =========================
        // 1. CHECK ADMIN EXISTS
        // =========================
        const [adminRows] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [ADMIN_EMAIL]
        );

        if (adminRows.length > 0) {
            console.log("[seed] admin ya existe:", ADMIN_EMAIL);
            return;
        }

        // =========================
        // 2. CREATE ADMIN
        // =========================
        const adminId = uuidv4();
        const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

        await pool.query(
            `INSERT INTO users (id, username, email, password, role, plan, email_verified, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'admin', 'premium', 1, NOW(), NOW())`,
            [
                adminId,
                "Administrador",
                ADMIN_EMAIL,
                adminHash
            ]
        );

        console.log("[seed] admin creado:", ADMIN_EMAIL);

        // =========================
        // 3. CREATE DEMO AUTHOR
        // =========================
        const authorId = uuidv4();
        const authorPassword = await bcrypt.hash("Autor123!", 12);

        await pool.query(
            `INSERT INTO users (id, username, email, password, role, plan, email_verified, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'user', 'free', 1, NOW(), NOW())`,
            [
                authorId,
                "Autor Demo",
                "autor@jpphub.com",
                authorPassword
            ]
        );

        console.log("[seed] autor demo creado: autor@jpphub.com");

        // =========================
        // 4. DEMO POST (APPROVED)
        // =========================
        const postId1 = uuidv4();

        await pool.query(
            `INSERT INTO posts (
                id, title, slug, description, content,
                category, author, author_id,
                views, status, published_at,
                created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'approved', NOW(), NOW(), NOW())`,
            [
                postId1,
                "El impacto de la IA en los negocios 2026",
                "el-impacto-de-la-ia-en-los-negocios-2026",
                "Cómo la inteligencia artificial está transformando cada industria en 2026.",
                "La inteligencia artificial ha dejado de ser una promesa futurista para convertirse en una herramienta clave en empresas modernas...",
                "Inteligencia Artificial",
                "Autor Demo",
                authorId
            ]
        );

        // =========================
        // 5. DEMO POST (PENDING)
        // =========================
        const postId2 = uuidv4();

        await pool.query(
            `INSERT INTO posts (
                id, title, slug, description, content,
                category, author, author_id,
                views, status,
                created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', NOW(), NOW())`,
            [
                postId2,
                "Automatiza tu negocio con n8n en 7 pasos",
                "automatiza-tu-negocio-con-n8n-en-7-pasos",
                "Guía práctica para automatizar procesos con n8n.",
                "n8n es una herramienta open-source para automatización de workflows sin código...",
                "Automatización",
                "Autor Demo",
                authorId
            ]
        );

        console.log("[seed] posts demo creados");

        // =========================
        // DONE
        // =========================
        console.log("✅ [seed] completado correctamente");

    } catch (error) {
        console.error("[seed] error:", error.message);
    }
}

export default seedAdmin;
