const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const verifyToken = require('../middlewares/auth.middleware');  

router.post('/create', verifyToken, groupController.createGroup);

router.get('/search/:court_id', verifyToken, groupController.searchGroupByCourt);

// Añadir más rutas según sea necesario

module.exports = router;