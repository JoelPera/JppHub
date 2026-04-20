import { v4 as uuidv4 } from 'uuid';
import { postRepository } from '../repositories/postRepository.js';

export class ArticleService {
    static async getAllArticles() {
        return postRepository.findAll();
    }

    static async getArticleById(id) {
        return postRepository.findById(id);
    }

    static async createArticle(articleData) {
        const payload = {
            id: uuidv4(),
            title: articleData.title,
            description: articleData.description,
            content: articleData.content,
            category: articleData.category || 'General',
            author: articleData.author || 'Admin',
            status: articleData.status || 'draft'
        };
        return postRepository.create(payload);
    }

    static async updateArticle(id, updates) {
        return postRepository.update(id, updates);
    }

    static async deleteArticle(id) {
        return postRepository.delete(id);
    }

    static async incrementArticleViews(id) {
        return postRepository.incrementViews(id);
    }
}

export default ArticleService;
