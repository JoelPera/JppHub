import pool from '../database/db.js';

export const contactRepository = {
    async create(messageData) {
        const sql = `
            INSERT INTO contact_messages (id, name, email, subject, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'new', NOW())
        `;
        await pool.query(sql, [
            messageData.id,
            messageData.name,
            messageData.email,
            messageData.subject || null,
            messageData.message
        ]);
        return this.findById(messageData.id);
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, name, email, subject, message, status, created_at AS createdAt
            FROM contact_messages ORDER BY created_at DESC
        `);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, name, email, subject, message, status, created_at AS createdAt
            FROM contact_messages WHERE id = ? LIMIT 1
        `, [id]);
        return rows[0] || null;
    }
};
