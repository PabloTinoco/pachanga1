const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole');

// Ruta protegida para administradores
router.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({
    message: 'Bienvenido, Administrador',
    user: req.user
  });
});

module.exports = router;
