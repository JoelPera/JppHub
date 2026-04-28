import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import pool from "./db.js";

const ADMIN_EMAIL = "admin@jpphub.com";
const ADMIN_PASSWORD = "Admin123!";
const AUTHOR_EMAIL = "autor@jpphub.com";
const AUTHOR_PASSWORD = "Autor123!";

export async function seedAdmin() {
    try {
        // ========== ADMIN ==========
        const [adminRows] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [ADMIN_EMAIL]
        );
        let adminId;
        if (adminRows.length > 0) {
            adminId = adminRows[0].id;
            console.log("[seed] admin ya existe:", ADMIN_EMAIL);
        } else {
            adminId = uuidv4();
            const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
            await pool.query(
                `INSERT INTO users (id, name, email, password_hash, role, provider, status, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 'admin', 'local', 'active', NOW(), NOW())`,
                [adminId, "Administrador", ADMIN_EMAIL, adminHash]
            );
            console.log("[seed] admin creado:", ADMIN_EMAIL);
        }

        // ========== AUTOR DEMO ==========
        const [authorRows] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [AUTHOR_EMAIL]
        );
        let authorId;
        if (authorRows.length > 0) {
            authorId = authorRows[0].id;
            console.log("[seed] autor demo ya existe:", AUTHOR_EMAIL);
        } else {
            authorId = uuidv4();
            const authorHash = await bcrypt.hash(AUTHOR_PASSWORD, 12);
            await pool.query(
                `INSERT INTO users (id, name, email, password_hash, role, provider, status, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 'author', 'local', 'active', NOW(), NOW())`,
                [authorId, "Autor Demo", AUTHOR_EMAIL, authorHash]
            );
            console.log("[seed] autor demo creado:", AUTHOR_EMAIL);
        }

        // ========== POSTS DEMO (idempotente por slug) ==========
        const demoPosts = [
            {
                title: "El impacto de la IA en los negocios 2026",
                slug: "el-impacto-de-la-ia-en-los-negocios-2026",
                description: "Cómo la inteligencia artificial está transformando cada industria en 2026.",
                content: "<h2>Introducción</h2><p>La inteligencia artificial ha dejado de ser una promesa futurista para convertirse en una herramienta clave en empresas modernas. Desde la atención al cliente automatizada hasta la toma de decisiones basada en datos en tiempo real, la IA redefine cómo competimos.</p><h2>Casos reales</h2><p>Empresas como Stripe, Notion y Linear integran modelos de lenguaje para acelerar flujos internos y experiencias de cliente. El resultado: menos fricción, más conversión.</p><h2>Conclusión</h2><p>2026 es el año en que la IA pasa de experimento a infraestructura básica. Quien no la adopte, pierde ventaja competitiva.</p>",
                category: "Inteligencia Artificial",
                status: "approved"
            },
            {
                title: "Automatiza tu negocio con n8n en 7 pasos",
                slug: "automatiza-tu-negocio-con-n8n-en-7-pasos",
                description: "Guía práctica para automatizar procesos con n8n sin escribir código.",
                content: "<h2>¿Qué es n8n?</h2><p>n8n es una herramienta open-source para automatización de workflows sin código. Conecta APIs, bases de datos y servicios con nodos visuales.</p><h2>Los 7 pasos</h2><ol><li>Instala n8n (Docker o cloud).</li><li>Crea tu primer workflow.</li><li>Conecta un trigger (webhook, cron, form).</li><li>Añade acciones (email, Slack, DB).</li><li>Usa expresiones para transformar datos.</li><li>Prueba con datos reales.</li><li>Despliega y monitoriza.</li></ol><p>En menos de una tarde tienes tu primera automatización en producción.</p>",
                category: "Automatización",
                status: "approved"
            },
            {
                title: "Prompt engineering avanzado con GPT-5",
                slug: "prompt-engineering-avanzado-con-gpt-5",
                description: "Técnicas avanzadas para obtener resultados consistentes con modelos grandes.",
                content: "<h2>Principios</h2><p>Un buen prompt es claro, específico y anclado en contexto. Evita ambigüedad, da ejemplos, y define el formato de salida.</p><h2>Técnicas</h2><ul><li><strong>Few-shot</strong>: dos o tres ejemplos antes de la tarea.</li><li><strong>Chain-of-thought</strong>: pide al modelo razonar paso a paso.</li><li><strong>Self-critique</strong>: haz que el modelo valide su propia respuesta.</li></ul>",
                category: "Inteligencia Artificial",
                status: "approved"
            },
            {
                title: "Cómo diseñar un SaaS desde cero en 2026",
                slug: "como-disenar-un-saas-desde-cero-en-2026",
                description: "Stack, arquitectura y decisiones clave para lanzar un SaaS moderno.",
                content: "<h2>Stack recomendado</h2><p>React + Vite + Tailwind en frontend. Node.js o Python FastAPI en backend. Postgres o MySQL gestionados. Autenticación con JWT o magic links. Pagos con Stripe.</p><h2>Decisiones clave</h2><p>Multitenancy, monorepo vs split, observabilidad desde el día 1, CI/CD automatizado.</p>",
                category: "SaaS",
                status: "pending"
            }
        ];

        for (const p of demoPosts) {
            const [existing] = await pool.query(
                "SELECT id FROM posts WHERE slug = ? LIMIT 1",
                [p.slug]
            );
            if (existing.length > 0) continue;
            const id = uuidv4();
            await pool.query(
                `INSERT INTO posts (id, title, slug, description, content, category, author, author_id, views, status, published_at, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
                [
                    id, p.title, p.slug, p.description, p.content,
                    p.category, "Autor Demo", authorId, p.status,
                    p.status === "approved" ? new Date() : null
                ]
            );
        }

        console.log("[seed] completado");
    } catch (error) {
        console.error("[seed] error:", error.message);
    }
}

export default seedAdmin;
