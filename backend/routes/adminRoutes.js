import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { adminController } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/activity', adminController.getActivityLogs);
router.get('/stats', adminController.getDashboardStats);

export default router;
