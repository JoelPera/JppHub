import express from 'express';
import ArticleController from '../controllers/articleController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
import {
    createArticleSchema,
    updateArticleSchema,
    reviewArticleSchema
} from '../validators/articleValidators.js';

const router = express.Router();

// Detalle por slug (público, solo si está aprobado)
router.get('/slug/:slug', ArticleController.getArticleBySlug);

// Público (solo aprobados)
router.get('/', ArticleController.getPublishedArticles);

// Autenticado - mis artículos (ANTES de :id)
router.get('/mine', authenticate, ArticleController.getMyArticles);

// Admin - todos (pending/approved/rejected/in_review)
router.get('/all', authenticate, permit('admin'), ArticleController.getAllArticles);
router.get('/stats', authenticate, permit('admin'), ArticleController.getStats);

// Detalle público por ID
router.get('/:id', ArticleController.getArticleById);

// Incrementar vistas
router.patch('/:id/views', ArticleController.incrementArticleViews);

// Enviar artículo (cualquier usuario autenticado)
router.post('/', authenticate, validateRequest(createArticleSchema), ArticleController.submitArticle);

// Editar: autor o admin
router.put('/:id', authenticate, validateRequest(updateArticleSchema), ArticleController.updateArticle);

// Revisión: approve/reject/review (solo admin)
router.post('/:id/review', authenticate, permit('admin'), validateRequest(reviewArticleSchema), ArticleController.reviewArticle);

// Eliminar (solo admin)
router.delete('/:id', authenticate, permit('admin'), ArticleController.deleteArticle);

export default router;
