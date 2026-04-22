import { userRepository } from '../repositories/userRepository.js';
import { postRepository } from '../repositories/postRepository.js';

export const userController = {
    async getProfile(req, res, next) {
        try {
            const user = await userRepository.findById(req.user.id);
            if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
            return res.json({ status: 'success', data: user });
        } catch (error) { next(error); }
    },

    async updateProfile(req, res, next) {
        try {
            const { name, bio, avatarUrl } = req.body;
            if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
                return res.status(400).json({ status: 'error', message: 'Nombre inválido' });
            }
            if (bio !== undefined && typeof bio !== 'string') {
                return res.status(400).json({ status: 'error', message: 'Bio inválida' });
            }
            const updated = await userRepository.updateProfile(req.user.id, { name, bio, avatarUrl });
            return res.json({ status: 'success', message: 'Perfil actualizado', data: updated });
        } catch (error) { next(error); }
    },

    async getPublicProfile(req, res, next) {
        try {
            const profile = await userRepository.findPublicProfile(req.params.id);
            if (!profile) return res.status(404).json({ status: 'error', message: 'Autor no encontrado' });
            // Approved articles by this author
            const posts = await postRepository.findAll({ authorId: profile.id, status: 'approved' });
            return res.json({
                status: 'success',
                data: { profile, articles: posts, count: posts.length }
            });
        } catch (error) { next(error); }
    },

    async listUsers(req, res, next) {
        try {
            const users = await userRepository.findAll();
            return res.json({ status: 'success', data: users, count: users.length });
        } catch (error) { next(error); }
    }
};

export default userController;
