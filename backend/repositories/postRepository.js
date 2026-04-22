import pool from '../database/db.js';

const generateSlug = (title) =>
    title
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i')
        .replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u').replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const SELECT_FIELDS = `
    p.id, p.title, p.slug, p.description, p.content, p.cover_image AS coverImage,
    p.category, p.author, p.author_id AS authorId, p.views, p.status,
    p.review_note AS reviewNote, p.reviewed_by AS reviewedBy, p.reviewed_at AS reviewedAt,
    p.published_at AS publishedAt, p.created_at AS createdAt, p.updated_at AS updatedAt,
    u.username AS authorName, u.email AS authorEmail
`;

export const postRepository = {
    // Solo artículos aprobados para la web pública
    async findAllPublished() {
        const [rows] = await pool.query(`
            SELECT ${SELECT_FIELDS}
            FROM posts p LEFT JOIN users u ON u.id = p.author_id
            WHERE p.status = 'approved'
            ORDER BY p.published_at DESC, p.created_at DESC
        `);
        return rows;
    },

    // Todos (admin)
    async findAll(filters = {}) {
        const conditions = [];
        const values = [];
        if (filters.status) { conditions.push('p.status = ?'); values.push(filters.status); }
        if (filters.authorId) { conditions.push('p.author_id = ?'); values.push(filters.authorId); }
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const [rows] = await pool.query(`
            SELECT ${SELECT_FIELDS}
            FROM posts p LEFT JOIN users u ON u.id = p.author_id
            ${where}
            ORDER BY p.created_at DESC
        `, values);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT ${SELECT_FIELDS}
            FROM posts p LEFT JOIN users u ON u.id = p.author_id
            WHERE p.id = ? LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async findBySlug(slug) {
        const [rows] = await pool.query(`
            SELECT ${SELECT_FIELDS}
            FROM posts p LEFT JOIN users u ON u.id = p.author_id
            WHERE p.slug = ? LIMIT 1
        `, [slug]);
        return rows[0] || null;
    },

    async create(data) {
        let slug = data.slug || generateSlug(data.title);
        // Asegurar slug único
        const [existing] = await pool.query('SELECT id FROM posts WHERE slug = ? LIMIT 1', [slug]);
        if (existing.length) slug = `${slug}-${Date.now().toString(36)}`;

        const status = data.status || 'pending';
        const sql = `
            INSERT INTO posts (id, title, slug, description, content, cover_image, category, author, author_id, views, status, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())
        `;
        await pool.query(sql, [
            data.id, data.title, slug, data.description || '', data.content || '',
            data.coverImage || null, data.category || 'General',
            data.author || 'Anónimo', data.authorId || null, status,
            status === 'approved' ? new Date() : null
        ]);
        return this.findById(data.id);
    },

    async update(id, updates) {
        const fields = [];
        const values = [];

        const map = {
            title: 'title', description: 'description', content: 'content',
            coverImage: 'cover_image', category: 'category', author: 'author'
        };
        for (const [key, col] of Object.entries(map)) {
            if (updates[key] !== undefined) { fields.push(`${col} = ?`); values.push(updates[key]); }
        }
        if (updates.title) {
            fields.push('slug = ?'); values.push(generateSlug(updates.title));
        }
        if (updates.status) {
            fields.push('status = ?'); values.push(updates.status);
            if (updates.status === 'approved') {
                fields.push('published_at = IFNULL(published_at, NOW())');
            }
        }
        if (updates.reviewNote !== undefined) {
            fields.push('review_note = ?'); values.push(updates.reviewNote);
        }
        if (updates.reviewedBy !== undefined) {
            fields.push('reviewed_by = ?'); values.push(updates.reviewedBy);
            fields.push('reviewed_at = NOW()');
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(`UPDATE posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
        return this.findById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    async incrementViews(id) {
        await pool.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
        return this.findById(id);
    },

    async countByStatus() {
        const [rows] = await pool.query(`SELECT status, COUNT(*) AS count FROM posts GROUP BY status`);
        return rows.reduce((acc, r) => ({ ...acc, [r.status]: Number(r.count) }), {});
    }
};
