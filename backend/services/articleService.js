import { v4 as uuidv4 } from 'uuid';
import { postRepository } from '../repositories/postRepository.js';

export class ArticleService {
    // Público: solo aprobados
    static async getPublishedArticles() {
        return postRepository.findAllPublished();
    }

    // Admin: todos (opcional filtrar por estado)
    static async getAllArticles(filters = {}) {
        return postRepository.findAll(filters);
    }

    // Usuario: sus propios artículos
    static async getMyArticles(userId) {
        return postRepository.findAll({ authorId: userId });
    }

    static async getArticleById(id) {
        return postRepository.findById(id);
    }

    // Submit por un autor: va a estado 'pending'
    static async submitArticle(articleData, user) {
        return postRepository.create({
            id: uuidv4(),
            title: articleData.title,
            description: articleData.description,
            content: articleData.content,
            coverImage: articleData.coverImage,
            category: articleData.category || 'General',
            author: user?.name || articleData.author || 'Anónimo',
            authorId: user?.id || null,
            status: articleData.status === 'draft' ? 'draft' : 'pending'
        });
    }

    // Admin crea directamente un artículo aprobado
    static async adminCreateArticle(articleData, admin) {
        return postRepository.create({
            id: uuidv4(),
            ...articleData,
            author: articleData.author || admin?.name || 'Admin',
            authorId: admin?.id || null,
            status: articleData.status || 'approved'
        });
    }

    static async updateArticle(id, updates, user) {
        const article = await postRepository.findById(id);
        if (!article) return null;
        // Si no es admin, solo el autor puede editar y vuelve a pending
        if (user?.role !== 'admin') {
            if (article.authorId !== user.id) {
                const err = new Error('No tienes permiso para editar este artículo');
                err.status = 403;
                throw err;
            }
            // Edits por autor lo vuelven a pending
            updates.status = 'pending';
        }
        return postRepository.update(id, updates);
    }

    static async reviewArticle(id, action, adminId, note) {
        const map = { approve: 'approved', reject: 'rejected', review: 'in_review' };
        const status = map[action];
        if (!status) {
            const err = new Error('Acción de revisión inválida'); err.status = 400; throw err;
        }
        return postRepository.update(id, { status, reviewedBy: adminId, reviewNote: note || null });
    }

    static async deleteArticle(id) {
        return postRepository.delete(id);
    }

    static async incrementArticleViews(id) {
        return postRepository.incrementViews(id);
    }

    static async getStats() {
        return postRepository.countByStatus();
    }
}

export default ArticleService;
