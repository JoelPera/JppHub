import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { userRepository } from '../repositories/userRepository.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        const user = await userRepository.findById(payload.id);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Token inválido' });
        }
        req.user = { id: user.id, email: user.email, role: user.role };
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Autenticación fallida' });
    }
};
