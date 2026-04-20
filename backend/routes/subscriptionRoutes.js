import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { subscriptionController } from '../controllers/subscriptionController.js';
import { subscriptionSchema } from '../validators/subscriptionValidators.js';

const router = express.Router();

router.get('/', authenticate, subscriptionController.getSubscription);
router.post('/', authenticate, validateRequest(subscriptionSchema), subscriptionController.createSubscription);
router.patch('/cancel', authenticate, subscriptionController.cancelSubscription);

export default router;
