import Joi from 'joi';

const articlePayload = Joi.object({
    title: Joi.string().trim().min(5).max(255).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    content: Joi.string().trim().min(20).required(),
    category: Joi.string().trim().max(100).optional(),
    author: Joi.string().trim().max(100).optional()
});

export const createArticleSchema = Joi.object({
    body: articlePayload,
    params: Joi.object().empty(),
    query: Joi.object().empty()
});

export const updateArticleSchema = Joi.object({
    body: Joi.object({
        title: Joi.string().trim().min(5).max(255).optional(),
        description: Joi.string().trim().min(10).max(1000).optional(),
        content: Joi.string().trim().min(20).optional(),
        category: Joi.string().trim().max(100).optional(),
        author: Joi.string().trim().max(100).optional()
    }).min(1),
    params: Joi.object({
        id: Joi.string().uuid().required()
    }),
    query: Joi.object().empty()
});
