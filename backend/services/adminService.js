import UserService from './userService.js';
import SubscriptionService from './subscriptionService.js';
import PaymentService from './paymentService.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

class AdminService {
    static async listUsers() {
        return UserService.listUsers();
    }

    static async listSubscriptions() {
        return SubscriptionService.listSubscriptions();
    }

    static async listPayments() {
        return PaymentService.listPayments();
    }

    static async listActivityLogs() {
        return activityLogRepository.findAll();
    }
}

export default AdminService;
