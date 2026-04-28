// ========== MANEJO GLOBAL DE ERRORES ==========
export const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const status = err.status || err.statusCode || 500;
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
