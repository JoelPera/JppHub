export const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Acceso denegado: permisos insuficientes'
            });
        }
        next();
    };
};
