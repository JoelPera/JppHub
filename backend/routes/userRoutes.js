import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { userController } from '../controllers/userController.js';

const router = express.Router();

// Current user
router.get('/me', authenticate, userController.getProfile);
router.patch('/me', authenticate, userController.updateProfile);

// Public author profile + approved articles
router.get('/:id/profile', userController.getPublicProfile);

// Admin
router.get('/', authenticate, authorize('admin'), userController.listUsers);

export default router;
