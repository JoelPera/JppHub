import { categoryRepository } from '../repositories/categoryRepository.js';

class CategoryService {
    static async listCategories() {
        return categoryRepository.findAll();
    }

    static async createCategory(category) {
        return categoryRepository.create(category);
    }

    static async updateCategory(id, updates) {
        return categoryRepository.update(id, updates);
    }

    static async deleteCategory(id) {
        return categoryRepository.delete(id);
    }
}

export default CategoryService;
