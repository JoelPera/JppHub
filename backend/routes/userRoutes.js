import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticate, userController.getProfile);
router.get('/', authenticate, authorize('admin'), userController.listUsers);

export default router;
