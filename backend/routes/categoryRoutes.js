import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { categoryController } from '../controllers/categoryController.js';
import { categorySchema } from '../validators/categoryValidators.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', authenticate, authorize('admin'), validateRequest(categorySchema), categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin'), validateRequest(categorySchema), categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

export default router;
