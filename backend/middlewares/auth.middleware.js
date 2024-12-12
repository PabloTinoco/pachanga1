const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, no se encontró el token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Aquí estamos guardando los datos del usuario en req.user
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido' });
  }
}

module.exports = verifyToken;
