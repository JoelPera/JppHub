import { paymentRepository } from '../repositories/paymentRepository.js';

class PaymentService {
    static async createPayment(payment) {
        return paymentRepository.create(payment);
    }

    static async getUserPayments(userId) {
        return paymentRepository.findByUserId(userId);
    }

    static async listPayments() {
        return paymentRepository.findAll();
    }
}

export default PaymentService;
