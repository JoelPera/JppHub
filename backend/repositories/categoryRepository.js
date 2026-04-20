import pool from '../database/db.js';

export const categoryRepository = {
    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, name, slug, description, created_at AS createdAt, updated_at AS updatedAt
            FROM categories
            ORDER BY name ASC
        `);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, name, slug, description, created_at AS createdAt, updated_at AS updatedAt
            FROM categories
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async create(data) {
        const sql = `
            INSERT INTO categories (id, name, slug, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())
        `;
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        await pool.query(sql, [data.id, data.name, slug, data.description]);
        return this.findById(data.id);
    },

    async update(id, updates) {
        const fields = [];
        const values = [];

        if (updates.name) {
            fields.push('name = ?');
            values.push(updates.name);
            fields.push('slug = ?');
            values.push(updates.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
        }
        if (updates.description) {
            fields.push('description = ?');
            values.push(updates.description);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const sql = `UPDATE categories SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        await pool.query(sql, values);
        return this.findById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};
