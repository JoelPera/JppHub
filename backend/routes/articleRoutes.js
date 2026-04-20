import express from 'express';
import ArticleController from '../controllers/articleController.js';

const router = express.Router();

// ========== RUTAS DE ARTÍCULOS ==========

// GET /api/articles - Obtener todos los artículos
router.get('/', ArticleController.getAllArticles);

// GET /api/articles/:id - Obtener artículo específico
router.get('/:id', ArticleController.getArticleById);

// POST /api/articles - Crear nuevo artículo
router.post('/', ArticleController.createArticle);

// PUT /api/articles/:id - Actualizar artículo
router.put('/:id', ArticleController.updateArticle);

// DELETE /api/articles/:id - Eliminar artículo
router.delete('/:id', ArticleController.deleteArticle);

export default router;
