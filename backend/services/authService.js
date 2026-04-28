import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from '../repositories/userRepository.js';
import { sessionRepository } from '../repositories/sessionRepository.js';
import { config } from '../config/config.js';
import pool from '../database/db.js';

const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.JWT_SECRET,
        { expiresIn: '12h' }
    );
};

class AuthService {
    static async register(payload, req) {
        const existingUser = await userRepository.findByEmail(payload.email);
        if (existingUser) {
            const error = new Error('El correo ya está registrado');
            error.status = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(payload.password, 12);
        const userData = {
            id: uuidv4(),
            name: payload.name,
            email: payload.email,
            passwordHash,
            role: payload.role || 'user'
        };

        const createdUser = await userRepository.create(userData);
        const token = createToken(createdUser);

        await sessionRepository.create({
            id: uuidv4(),
            userId: createdUser.id,
            token,
            userAgent: req.get('User-Agent') || 'unknown',
            ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
        });

        return {
            user: createdUser,
            token
        };
    }

    static async login(email, password, req) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.status = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            const error = new Error('Credenciales inválidas');
            error.status = 401;
            throw error;
        }

        const token = createToken(user);
        await sessionRepository.create({
            id: uuidv4(),
            userId: user.id,
            token,
            userAgent: req.get('User-Agent') || 'unknown',
            ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
        });
        await userRepository.updateLastLogin(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        };
    }

    // Emergent-managed Google OAuth
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    static async googleLogin(sessionId, req) {
        if (!sessionId) {
            const err = new Error('session_id requerido'); err.status = 400; throw err;
        }
        // Call Emergent Auth to exchange session_id → user data
        const res = await fetch('https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data', {
            method: 'GET',
            headers: { 'X-Session-ID': sessionId }
        });
        if (!res.ok) {
            const err = new Error('No se pudo validar sesión de Google');
            err.status = 401; throw err;
        }
        const data = await res.json();
        // Upsert user in MySQL
        let user = await userRepository.findByEmail(data.email);
        if (!user) {
            const passwordHash = await bcrypt.hash(uuidv4(), 12); // random unusable pwd
            const newUserId = uuidv4();
            await pool.query(
                `INSERT INTO users (id, name, email, password_hash, role, provider, avatar_url, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 'user', 'google', ?, NOW(), NOW())`,
                [newUserId, data.name || data.email, data.email, passwordHash, data.picture || null]
            );
            user = await userRepository.findById(newUserId);
        } else {
            await pool.query('UPDATE users SET provider = ?, avatar_url = IFNULL(?, avatar_url) WHERE id = ?',
                ['google', data.picture || null, user.id]);
        }
        const token = createToken(user);
        await sessionRepository.create({
            id: uuidv4(),
            userId: user.id,
            token,
            userAgent: req.get('User-Agent') || 'unknown',
            ipAddress: req.ip || 'unknown',
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
        });
        await userRepository.updateLastLogin(user.id);
        return {
            user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
            token
        };
    }
}

export default AuthService;
