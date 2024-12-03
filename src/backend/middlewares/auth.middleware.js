const jwt = require('jsonwebtoken');

// Middleware para verificar si el token es válido
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // El token puede llegar con el prefijo "Bearer ", lo eliminamos si está presente
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verificamos el token con la clave secreta
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Guardamos los datos del usuario decodificados en el objeto `req`
    req.user = decoded;
    next();  // Continuamos con la siguiente función del pipeline
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = verifyToken;
