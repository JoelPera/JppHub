import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { paymentController } from '../controllers/paymentController.js';
import { paymentSchema } from '../validators/paymentValidators.js';

const router = express.Router();

router.get('/', authenticate, paymentController.getUserPayments);
router.post('/', authenticate, validateRequest(paymentSchema), paymentController.createPayment);

export default router;
