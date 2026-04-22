import pool from '../database/db.js';

export const userRepository = {
    async findByEmail(email) {
        const [rows] = await pool.query(`
            SELECT id, name, email, password_hash AS passwordHash, role, status, provider,
                   created_at AS createdAt, updated_at AS updatedAt
            FROM users WHERE email = ? LIMIT 1
        `, [email]);
        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT id, name, email, role, status, avatar_url AS avatarUrl, bio,
                   created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin
            FROM users WHERE id = ? LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async findPublicProfile(id) {
        const [rows] = await pool.query(`
            SELECT id, name, role, avatar_url AS avatarUrl, bio, created_at AS createdAt
            FROM users WHERE id = ? LIMIT 1
        `, [id]);
        return rows[0] || null;
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT id, name, email, role, status, avatar_url AS avatarUrl, bio,
                   created_at AS createdAt, last_login AS lastLogin
            FROM users
            ORDER BY created_at DESC
        `);
        return rows;
    },

    async create(userData) {
        const sql = `
            INSERT INTO users (id, name, email, password_hash, role, provider, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const values = [
            userData.id,
            userData.name,
            userData.email,
            userData.passwordHash,
            userData.role || 'user',
            userData.provider || 'local'
        ];
        await pool.query(sql, values);
        return this.findById(userData.id);
    },

    async updateRole(id, role) {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        return this.findById(id);
    },

    async updateProfile(id, { name, bio, avatarUrl }) {
        const fields = [];
        const values = [];
        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (bio !== undefined) { fields.push('bio = ?'); values.push(bio); }
        if (avatarUrl !== undefined) { fields.push('avatar_url = ?'); values.push(avatarUrl); }
        if (fields.length === 0) return this.findById(id);
        values.push(id);
        await pool.query(`UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
        return this.findById(id);
    },

    async updateLastLogin(id) {
        await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
    }
};
