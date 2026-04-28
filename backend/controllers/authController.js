import AuthService from '../services/authService.js';
import { userRepository } from '../repositories/userRepository.js';

export class AuthController {
    static async register(req, res, next) {
        try {
            console.log('[AUTH] register payload:', req.body);
            const payload = req.body;
            const authResult = await AuthService.register(payload, req);
            res.status(201).json({
                status: 'success',
                message: 'Usuario registrado correctamente',
                data: authResult
            });
        } catch (error) {
            console.error('[AUTH] register error:', error);
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const authResult = await AuthService.login(email, password, req);
            res.status(200).json({
                status: 'success',
                message: 'Inicio de sesión correcto',
                data: authResult
            });
        } catch (error) {
            next(error);
        }
    }

    static async me(req, res, next) {
        try {
            const user = await userRepository.findById(req.user.id);
            res.json({ status: 'success', data: user || req.user });
        } catch (err) { next(err); }
    }

    static async googleLogin(req, res, next) {
        try {
            const { session_id } = req.body;
            const data = await AuthService.googleLogin(session_id, req);
            res.json({ status: 'success', message: 'Login con Google correcto', data });
        } catch (err) { next(err); }
    }
}

export default AuthController;
