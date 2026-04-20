import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from '../repositories/userRepository.js';
import { sessionRepository } from '../repositories/sessionRepository.js';
import { config } from '../config/config.js';

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
}

export default AuthService;
