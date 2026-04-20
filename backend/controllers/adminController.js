import AdminService from '../services/adminService.js';

export const adminController = {
    async getUsers(req, res, next) {
        try {
            const users = await AdminService.listUsers();
            return res.json(users);
        } catch (error) {
            next(error);
        }
    },

    async getSubscriptions(req, res, next) {
        try {
            const subscriptions = await AdminService.listSubscriptions();
            return res.json(subscriptions);
        } catch (error) {
            next(error);
        }
    },

    async getPayments(req, res, next) {
        try {
            const payments = await AdminService.listPayments();
            return res.json(payments);
        } catch (error) {
            next(error);
        }
    },

    async getActivityLogs(req, res, next) {
        try {
            const logs = await AdminService.listActivityLogs();
            return res.json(logs);
        } catch (error) {
            next(error);
        }
    }
};
