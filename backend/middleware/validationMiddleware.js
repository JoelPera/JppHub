import Joi from 'joi';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(
            {
                body: req.body,
                params: req.params,
                query: req.query
            },
            {
                abortEarly: false,
                stripUnknown: true
            }
        );

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Datos de entrada inválidos',
                details: error.details.map(detail => detail.message)
            });
        }

        req.body = value.body;
        req.params = value.params;
        req.query = value.query;
        next();
    };
};
