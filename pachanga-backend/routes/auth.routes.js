const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');


// Ruta para registrar usuarios
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta protegida que solo pueden acceder los usuarios autenticados
router.get('/profile', verifyToken, authController.getProfile);

// Ruta para logout
router.post('/logout', (req, res) => {
  // Aquí podrías eliminar el token del lado del cliente (por ejemplo, eliminar el token del localStorage).
  res.status(200).send({ message: 'Logout exitoso' });
});


module.exports = router;
