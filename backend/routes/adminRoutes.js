import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { adminController } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));
router.get('/users', adminController.getUsers);
router.get('/subscriptions', adminController.getSubscriptions);
router.get('/payments', adminController.getPayments);
router.get('/activity', adminController.getActivityLogs);

export default router;
