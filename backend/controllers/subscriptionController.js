import SubscriptionService from '../services/subscriptionService.js';

export const subscriptionController = {
    async getSubscription(req, res, next) {
        try {
            const subscription = await SubscriptionService.getUserSubscription(req.user.id);
            if (!subscription) {
                return res.status(404).json({ message: 'Subscription not found' });
            }
            return res.json(subscription);
        } catch (error) {
            next(error);
        }
    },

    async createSubscription(req, res, next) {
        try {
            const body = { ...req.body, userId: req.user.id };
            const subscription = await SubscriptionService.createSubscription(body);
            return res.status(201).json(subscription);
        } catch (error) {
            next(error);
        }
    },

    async cancelSubscription(req, res, next) {
        try {
            const subscription = await SubscriptionService.cancelSubscription(req.user.id);
            return res.json(subscription);
        } catch (error) {
            next(error);
        }
    }
};
