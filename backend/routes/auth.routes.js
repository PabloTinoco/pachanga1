const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

// Ruta para registrar usuarios
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta protegida que solo pueden acceder los usuarios autenticados
router.get('/profile', verifyToken, (req, res) => {
  // El usuario está autenticado, podemos acceder a su información
  res.json({
    message: 'Perfil de usuario',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
