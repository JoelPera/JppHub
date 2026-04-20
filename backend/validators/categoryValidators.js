import Joi from 'joi';

export const categorySchema = Joi.object({
    body: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).optional(),
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).allow('', null),
        slug: Joi.string().max(120).optional()
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true)
});
