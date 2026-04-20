import PaymentService from '../services/paymentService.js';

export const paymentController = {
    async getUserPayments(req, res, next) {
        try {
            const payments = await PaymentService.getUserPayments(req.user.id);
            return res.json(payments);
        } catch (error) {
            next(error);
        }
    },

    async createPayment(req, res, next) {
        try {
            const body = { ...req.body, userId: req.user.id };
            const payment = await PaymentService.createPayment(body);
            return res.status(201).json(payment);
        } catch (error) {
            next(error);
        }
    }
};
