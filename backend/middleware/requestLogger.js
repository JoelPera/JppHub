// ========== LOGGER DE SOLICITUDES ==========
export const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    const ip = req.ip;

    console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);

    next();
};
