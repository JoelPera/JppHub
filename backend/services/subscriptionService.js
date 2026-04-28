import { subscriptionRepository } from '../repositories/subscriptionRepository.js';
import { paymentRepository } from '../repositories/paymentRepository.js';

class SubscriptionService {
    static async getUserSubscription(userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    static async createSubscription(subscription) {
        const createdSubscription = await subscriptionRepository.create(subscription);
        await paymentRepository.create({
            id: subscription.payment.id,
            userId: subscription.userId,
            subscriptionId: createdSubscription.id,
            amount: subscription.payment.amount,
            currency: subscription.payment.currency,
            status: subscription.payment.status,
            provider: subscription.payment.provider,
            transactionId: subscription.payment.transactionId
        });
        return createdSubscription;
    }

    static async cancelSubscription(userId) {
        return subscriptionRepository.updateStatus(userId, 'cancelled', null);
    }

    static async listSubscriptions() {
        return subscriptionRepository.findAll();
    }
}

export default SubscriptionService;
