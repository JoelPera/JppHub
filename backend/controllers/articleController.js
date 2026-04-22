import { ArticleService } from '../services/articleService.js';

export class ArticleController {
    // GET /api/articles - Público (solo aprobados)
    static async getPublishedArticles(req, res, next) {
        try {
            const articles = await ArticleService.getPublishedArticles();
            res.json({ status: 'success', data: articles, count: articles.length });
        } catch (error) { next(error); }
    }

    // GET /api/articles/all - Admin (todos)
    static async getAllArticles(req, res, next) {
        try {
            const { status } = req.query;
            const articles = await ArticleService.getAllArticles(status ? { status } : {});
            res.json({ status: 'success', data: articles, count: articles.length });
        } catch (error) { next(error); }
    }

    // GET /api/articles/mine - Usuario autenticado
    static async getMyArticles(req, res, next) {
        try {
            const articles = await ArticleService.getMyArticles(req.user.id);
            res.json({ status: 'success', data: articles, count: articles.length });
        } catch (error) { next(error); }
    }

    static async getArticleById(req, res, next) {
        try {
            const article = await ArticleService.getArticleById(req.params.id);
            if (!article) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
            res.json({ status: 'success', data: article });
        } catch (error) { next(error); }
    }

    // Público por slug - solo si está aprobado
    static async getArticleBySlug(req, res, next) {
        try {
            const article = await ArticleService.getArticleBySlug(req.params.slug);
            if (!article || article.status !== 'approved') {
                return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
            }
            res.json({ status: 'success', data: article });
        } catch (error) { next(error); }
    }

    // POST /api/articles - Usuario autenticado envía a revisión
    static async submitArticle(req, res, next) {
        try {
            const newArticle = await ArticleService.submitArticle(req.body, req.user);
            res.status(201).json({
                status: 'success',
                message: 'Artículo enviado a revisión',
                data: newArticle
            });
        } catch (error) { next(error); }
    }

    // PUT /api/articles/:id - Autor (edita sus propios) o admin
    static async updateArticle(req, res, next) {
        try {
            const updated = await ArticleService.updateArticle(req.params.id, req.body, req.user);
            if (!updated) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
            res.json({ status: 'success', message: 'Artículo actualizado', data: updated });
        } catch (error) { next(error); }
    }

    // POST /api/articles/:id/review - Admin: approve/reject/review
    static async reviewArticle(req, res, next) {
        try {
            const { action, note } = req.body;
            const updated = await ArticleService.reviewArticle(req.params.id, action, req.user.id, note);
            if (!updated) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
            res.json({
                status: 'success',
                message: `Artículo marcado como ${updated.status}`,
                data: updated
            });
        } catch (error) { next(error); }
    }

    static async deleteArticle(req, res, next) {
        try {
            const ok = await ArticleService.deleteArticle(req.params.id);
            if (!ok) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
            res.json({ status: 'success', message: 'Artículo eliminado' });
        } catch (error) { next(error); }
    }

    static async incrementArticleViews(req, res, next) {
        try {
            const article = await ArticleService.incrementArticleViews(req.params.id);
            if (!article) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
            res.json({ status: 'success', data: article });
        } catch (error) { next(error); }
    }

    // GET /api/articles/stats - Admin
    static async getStats(req, res, next) {
        try {
            const stats = await ArticleService.getStats();
            res.json({ status: 'success', data: stats });
        } catch (error) { next(error); }
    }
}

export default ArticleController;
