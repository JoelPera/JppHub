import pool from '../database/db.js';

export const paymentRepository = {
    async create(data) {
        const sql = `
            INSERT INTO payments (id, user_id, subscription_id, amount, currency, status, provider, transaction_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        await pool.query(sql, [
            data.id,
            data.userId,
            data.subscriptionId,
            data.amount,
            data.currency,
            data.status,
            data.provider,
            data.transactionId
        ]);
        return this.findById(data.id);
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, subscription_id AS subscriptionId, amount, currency, status, provider, transaction_id AS transactionId, created_at AS createdAt, updated_at AS updatedAt
            FROM payments
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async findByUserId(userId) {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, subscription_id AS subscriptionId, amount, currency, status, provider, transaction_id AS transactionId, created_at AS createdAt, updated_at AS updatedAt
            FROM payments
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);
        return rows;
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, subscription_id AS subscriptionId, amount, currency, status, provider, transaction_id AS transactionId, created_at AS createdAt, updated_at AS updatedAt
            FROM payments
            ORDER BY created_at DESC
        `);
        return rows;
    }
};
