// Middleware de autorización por rol.
// Exporta tanto `permit` como `authorize` (alias) para compatibilidad.
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

export const authorize = permit;

export default permit;
