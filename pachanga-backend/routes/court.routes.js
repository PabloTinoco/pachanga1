const express = require('express');
const router = express.Router();
const courtController = require('../controllers/court.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Crear cancha
router.post('/register', verifyToken, courtController.createCourt);

// Validar cancha (solo admins)
router.put('/:id/validate', verifyToken, courtController.validateCourt);

// Eliminar cancha (solo admins)
router.delete('/delete/:id', verifyToken, courtController.deleteCourt);

router.get('/all', verifyToken, courtController.getAllCourts);

router.get('/country/:country_code', verifyToken, courtController.getCourtsByCountry);

router.get('/:id', verifyToken, courtController.getCourtById);

module.exports = router;
