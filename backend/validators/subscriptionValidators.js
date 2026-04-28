import Joi from 'joi';

export const subscriptionSchema = Joi.object({
    body: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).optional(),
        plan: Joi.string().valid('basic', 'pro', 'enterprise').required(),
        status: Joi.string().valid('active', 'pending', 'cancelled').optional(),
        startedAt: Joi.date().optional(),
        expiresAt: Joi.date().optional(),
        payment: Joi.object({
            id: Joi.string().guid({ version: ['uuidv4'] }).required(),
            amount: Joi.number().positive().required(),
            currency: Joi.string().length(3).required(),
            status: Joi.string().valid('success', 'pending', 'failed').required(),
            provider: Joi.string().max(50).required(),
            transactionId: Joi.string().max(100).required()
        }).required()
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true)
});
