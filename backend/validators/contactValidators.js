import Joi from 'joi';

export const contactSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().email().required(),
        message: Joi.string().trim().min(10).max(2000).required()
    }),
    params: Joi.object().empty(),
    query: Joi.object().empty()
});
