import express from 'express';
import ArticleController from '../controllers/articleController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
import { createArticleSchema, updateArticleSchema } from '../validators/articleValidators.js';

const router = express.Router();

// ========== RUTAS DE ARTÍCULOS ==========

router.get('/', ArticleController.getAllArticles);
router.get('/:id', ArticleController.getArticleById);
router.patch('/:id/views', ArticleController.incrementArticleViews);
router.post('/', authenticate, permit('admin'), validateRequest(createArticleSchema), ArticleController.createArticle);
router.put('/:id', authenticate, permit('admin'), validateRequest(updateArticleSchema), ArticleController.updateArticle);
router.delete('/:id', authenticate, permit('admin'), ArticleController.deleteArticle);

export default router;
