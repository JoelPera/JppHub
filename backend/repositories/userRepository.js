import pool from '../database/db.js';

export const userRepository = {
    async findByEmail(email) {
        const [rows] = await pool.query(`
            SELECT id, name, email, password_hash AS passwordHash, role, created_at AS createdAt, updated_at AS updatedAt
            FROM users
            WHERE email = ?
            LIMIT 1
        `, [email]);
        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, name, email, role, created_at AS createdAt, updated_at AS updatedAt
            FROM users
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async create(userData) {
        const sql = `
            INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const values = [userData.id, userData.name, userData.email, userData.passwordHash, userData.role];
        await pool.query(sql, values);
        return this.findById(userData.id);
    }
};
