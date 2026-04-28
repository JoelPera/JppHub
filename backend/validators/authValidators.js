import Joi from 'joi';

export const registerSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
        role: Joi.string().valid('user', 'admin').optional()
    }),
    params: Joi.object().empty(),
    query: Joi.object().empty()
});

export const loginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    params: Joi.object().empty(),
    query: Joi.object().empty()
});
