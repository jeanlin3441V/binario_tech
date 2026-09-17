const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const validarJWT = require('../middlewares/validarJWT');

router.post('/register', authController.registrar);

router.post('/login', authController.login);

router.get('/relatorio', validarJWT, authController.relatorio);

module.exports = router;

