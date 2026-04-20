import AuthService from '../services/authService.js';

export class AuthController {
    static async register(req, res, next) {
        try {
            const payload = req.body;
            const authResult = await AuthService.register(payload, req);
            res.status(201).json({
                status: 'success',
                message: 'Usuario registrado correctamente',
                data: authResult
            });
        } catch (error) {
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

    static async me(req, res) {
        res.json({
            status: 'success',
            data: req.user
        });
    }
}

export default AuthController;
