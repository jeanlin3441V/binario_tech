const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticarToken = require('../middlewares/autenticarToken');

// Rotas públicas
router.post('/register', authController.registrar);
router.post('/login', authController.login);

// Rota privada (exige Token JWT)
router.get('/perfil', autenticarToken, authController.perfil);

module.exports = router;
