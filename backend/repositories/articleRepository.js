import pool from '../database/db.js';

export const articleRepository = {
    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, title, description, content, category, author, created_at AS createdAt, updated_at AS updatedAt
            FROM posts
            ORDER BY created_at DESC
        `);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, title, description, content, category, author, created_at AS createdAt, updated_at AS updatedAt
            FROM posts
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async create(data) {
        const sql = `
            INSERT INTO posts (id, title, description, content, category, author, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const values = [data.id, data.title, data.description, data.content, data.category, data.author];
        await pool.query(sql, values);
        return this.findById(data.id);
    },

    async update(id, updates) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            if (['title', 'description', 'content', 'category', 'author'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const sql = `
            UPDATE posts
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = ?
        `;
        await pool.query(sql, values);
        return this.findById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    async search(query) {
        const likeQuery = `%${query}%`;
        const [rows] = await pool.query(`
            SELECT id, title, description, content, category, author, created_at AS createdAt, updated_at AS updatedAt
            FROM posts
            WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
            ORDER BY created_at DESC
        `, [likeQuery, likeQuery, likeQuery]);
        return rows;
    }
};
