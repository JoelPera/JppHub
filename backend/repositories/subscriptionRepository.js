import pool from '../database/db.js';

export const subscriptionRepository = {
    async findByUserId(userId) {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, plan, status, started_at AS startedAt, expires_at AS expiresAt, created_at AS createdAt, updated_at AS updatedAt
            FROM subscriptions
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 1
        `, [userId]);
        return rows[0] || null;
    },

    async create(data) {
        const sql = `
            INSERT INTO subscriptions (id, user_id, plan, status, started_at, expires_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        await pool.query(sql, [
            data.id,
            data.userId,
            data.plan,
            data.status,
            data.startedAt,
            data.expiresAt
        ]);
        return this.findByUserId(data.userId);
    },

    async updateStatus(userId, status, expiresAt = null) {
        const sql = `
            UPDATE subscriptions
            SET status = ?, expires_at = ?, updated_at = NOW()
            WHERE user_id = ?
        `;
        await pool.query(sql, [status, expiresAt, userId]);
        return this.findByUserId(userId);
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, plan, status, started_at AS startedAt, expires_at AS expiresAt, created_at AS createdAt, updated_at AS updatedAt
            FROM subscriptions
            ORDER BY created_at DESC
        `);
        return rows;
    }
};
