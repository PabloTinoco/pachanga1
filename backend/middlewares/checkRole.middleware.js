// Middleware para verificar el rol del usuario
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' });
    }
    next();
  };
};

module.exports = checkRole;
