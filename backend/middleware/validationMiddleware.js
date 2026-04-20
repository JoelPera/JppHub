// ========== MANEJO GLOBAL DE ERRORES ==========
export const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    console.error(`[${timestamp}] ERROR ${status}: ${message}`);

    res.status(status).json({
        status: 'error',
        code: status,
        message: message,
        timestamp: timestamp,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// ========== VALIDACIÓN DE SOLICITUDES ==========
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Validación simple - puedes reemplazar con Joi o similar
            if (schema && typeof schema === 'function') {
                const { error, value } = schema(req.body);
                if (error) {
                    return res.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
                req.body = value;
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};
