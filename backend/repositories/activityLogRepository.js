import pool from '../database/db.js';

export const activityLogRepository = {
    async create(entry) {
        const sql = `
            INSERT INTO activity_logs (id, user_id, action, details, ip_address, user_agent, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        await pool.query(sql, [
            entry.id,
            entry.userId,
            entry.action,
            entry.details,
            entry.ipAddress,
            entry.userAgent
        ]);
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, user_id AS userId, action, details, ip_address AS ipAddress, user_agent AS userAgent, created_at AS createdAt
            FROM activity_logs
            ORDER BY created_at DESC
        `);
        return rows;
    }
};
