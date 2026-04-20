import UserService from '../services/userService.js';

export const userController = {
    async getProfile(req, res, next) {
        try {
            const user = await UserService.getProfile(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async listUsers(req, res, next) {
        try {
            const users = await UserService.listUsers();
            return res.json(users);
        } catch (error) {
            next(error);
        }
    }
};
