import Joi from 'joi';

export const paymentSchema = Joi.object({
    body: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).optional(),
        subscriptionId: Joi.string().guid({ version: ['uuidv4'] }).optional(),
        amount: Joi.number().positive().required(),
        currency: Joi.string().length(3).required(),
        status: Joi.string().valid('success', 'pending', 'failed').required(),
        provider: Joi.string().max(50).required(),
        transactionId: Joi.string().max(100).required()
    }).required(),
    params: Joi.object({}).unknown(true),
    query: Joi.object({}).unknown(true)
});
