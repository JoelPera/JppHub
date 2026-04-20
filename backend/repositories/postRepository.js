import pool from '../database/db.js';

const generateSlug = (title) =>
    title
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export const postRepository = {
    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, title, slug, description, content, category, author, views, status, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt
            FROM posts
            WHERE status = 'published'
            ORDER BY published_at DESC, created_at DESC
        `);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, title, slug, description, content, category, author, views, status, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt
            FROM posts
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async findBySlug(slug) {
        const [rows] = await pool.query(`
            SELECT id, title, slug, description, content, category, author, views, status, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt
            FROM posts
            WHERE slug = ?
            LIMIT 1
        `, [slug]);
        return rows[0] || null;
    },

    async create(data) {
        const slug = data.slug || generateSlug(data.title);
        const sql = `
            INSERT INTO posts (id, title, slug, description, content, category, author, views, status, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())
        `;
        const values = [
            data.id,
            data.title,
            slug,
            data.description,
            data.content,
            data.category,
            data.author,
            data.status || 'draft',
            data.status === 'published' ? new Date() : null
        ];
        await pool.query(sql, values);
        return this.findById(data.id);
    },

    async update(id, updates) {
        const fields = [];
        const values = [];

        if (updates.title) {
            fields.push('title = ?');
            values.push(updates.title);
            fields.push('slug = ?');
            values.push(generateSlug(updates.title));
        }
        if (updates.description) {
            fields.push('description = ?');
            values.push(updates.description);
        }
        if (updates.content) {
            fields.push('content = ?');
            values.push(updates.content);
        }
        if (updates.category) {
            fields.push('category = ?');
            values.push(updates.category);
        }
        if (updates.author) {
            fields.push('author = ?');
            values.push(updates.author);
        }
        if (updates.status) {
            fields.push('status = ?');
            values.push(updates.status);
            if (updates.status === 'published') {
                fields.push('published_at = ?');
                values.push(new Date());
            }
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const sql = `UPDATE posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        await pool.query(sql, values);
        return this.findById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    async incrementViews(id) {
        await pool.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
        return this.findById(id);
    }
};
