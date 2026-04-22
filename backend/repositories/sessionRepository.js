import pool from '../database/db.js';

export const sessionRepository = {
    async create(sessionData) {
        const sql = `
            INSERT INTO sessions (id, user_id, token, user_agent, ip_address, expires_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const values = [
            sessionData.id,
            sessionData.userId,
            sessionData.token,
            sessionData.userAgent || null,
            sessionData.ipAddress || null,
            sessionData.expiresAt
        ];
        await pool.query(sql, values);
        return this.findByToken(sessionData.token);
    },

    async findByToken(token) {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, token, revoked, expires_at AS expiresAt, created_at AS createdAt
            FROM sessions
            WHERE token = ?
            LIMIT 1
        `, [token]);
        return rows[0] || null;
    },

    async revoke(token) {
        const [result] = await pool.query(`
            UPDATE sessions SET revoked = 1 WHERE token = ?
        `, [token]);
        return result.affectedRows > 0;
    }
};
