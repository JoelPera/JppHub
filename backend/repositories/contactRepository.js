import pool from '../database/db.js';

export const contactRepository = {
    async create(messageData) {
        const sql = `
            INSERT INTO contact_messages (id, name, email, message, read_flag, created_at, updated_at)
            VALUES (?, ?, ?, ?, false, NOW(), NOW())
        `;
        const values = [messageData.id, messageData.name, messageData.email, messageData.message];
        await pool.query(sql, values);
        return this.findById(messageData.id);
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, name, email, message, read_flag AS read, created_at AS createdAt, updated_at AS updatedAt
            FROM contact_messages
            ORDER BY created_at DESC
        `);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, name, email, message, read_flag AS read, created_at AS createdAt, updated_at AS updatedAt
            FROM contact_messages
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return rows[0] || null;
    }
};
