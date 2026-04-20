import { v4 as uuidv4 } from 'uuid';
import { articleRepository } from '../repositories/articleRepository.js';

export class ArticleService {
    static async getAllArticles() {
        return articleRepository.findAll();
    }

    static async getArticleById(id) {
        return articleRepository.findById(id);
    }

    static async createArticle(articleData) {
        const payload = {
            id: uuidv4(),
            title: articleData.title,
            description: articleData.description,
            content: articleData.content,
            category: articleData.category || 'General',
            author: articleData.author || 'Admin'
        };
        return articleRepository.create(payload);
    }

    static async updateArticle(id, updates) {
        return articleRepository.update(id, updates);
    }

    static async deleteArticle(id) {
        return articleRepository.delete(id);
    }

    static async searchArticles(query) {
        return articleRepository.search(query);
    }
}

export default ArticleService;
