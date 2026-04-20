import { ArticleService } from '../services/articleService.js';

// ========== CONTROLADOR DE ARTÍCULOS ==========
export class ArticleController {
    // Obtener todos los artículos
    static async getAllArticles(req, res, next) {
        try {
            const articles = ArticleService.getAllArticles();
            res.json({
                status: 'success',
                data: articles,
                count: articles.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener artículo por ID
    static async getArticleById(req, res, next) {
        try {
            const { id } = req.params;
            const article = ArticleService.getArticleById(id);

            if (!article) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Artículo no encontrado'
                });
            }

            res.json({
                status: 'success',
                data: article
            });
        } catch (error) {
            next(error);
        }
    }

    // Crear nuevo artículo
    static async createArticle(req, res, next) {
        try {
            const { title, description, content, category, author } = req.body;

            if (!title || !description || !content) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Campos requeridos: title, description, content'
                });
            }

            const newArticle = ArticleService.createArticle({
                title,
                description,
                content,
                category: category || 'General',
                author: author || 'Admin'
            });

            res.status(201).json({
                status: 'success',
                message: 'Artículo creado exitosamente',
                data: newArticle
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar artículo
    static async updateArticle(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const updatedArticle = ArticleService.updateArticle(id, updates);

            if (!updatedArticle) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Artículo no encontrado'
                });
            }

            res.json({
                status: 'success',
                message: 'Artículo actualizado exitosamente',
                data: updatedArticle
            });
        } catch (error) {
            next(error);
        }
    }

    // Eliminar artículo
    static async deleteArticle(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = ArticleService.deleteArticle(id);

            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Artículo no encontrado'
                });
            }

            res.json({
                status: 'success',
                message: 'Artículo eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ArticleController;
