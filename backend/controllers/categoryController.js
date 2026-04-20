import CategoryService from '../services/categoryService.js';

export const categoryController = {
    async getCategories(req, res, next) {
        try {
            const categories = await CategoryService.listCategories();
            return res.json(categories);
        } catch (error) {
            next(error);
        }
    },

    async createCategory(req, res, next) {
        try {
            const category = await CategoryService.createCategory(req.body);
            return res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    },

    async updateCategory(req, res, next) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            return res.json(category);
        } catch (error) {
            next(error);
        }
    },

    async deleteCategory(req, res, next) {
        try {
            const deleted = await CategoryService.deleteCategory(req.params.id);
            return res.json({ deleted });
        } catch (error) {
            next(error);
        }
    }
};
