import AdminService from '../services/adminService.js';

export const adminController = {
    async getUsers(req, res, next) {
        try {
            const users = await AdminService.listUsers();
            res.json({ status: 'success', data: users, count: users.length });
        } catch (error) { next(error); }
    },

    async updateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!['user', 'author', 'admin'].includes(role)) {
                return res.status(400).json({ status: 'error', message: 'Rol inválido' });
            }
            const user = await AdminService.updateUserRole(id, role);
            res.json({ status: 'success', data: user });
        } catch (error) { next(error); }
    },

    async getActivityLogs(req, res, next) {
        try {
            const logs = await AdminService.listActivityLogs();
            res.json({ status: 'success', data: logs });
        } catch (error) { next(error); }
    },

    async getDashboardStats(req, res, next) {
        try {
            const stats = await AdminService.getDashboardStats();
            res.json({ status: 'success', data: stats });
        } catch (error) { next(error); }
    }
};

export default adminController;
