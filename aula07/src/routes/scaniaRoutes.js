const express = require('express');
const router = express.Router();
const scaniaController = require('../controllers/scaniaController');
const validaVin = require('../middlewares/validaVin'); // Import do middleware

router.get('/', scaniaController.listarTelemetria);
router.post('/', validaVin, scaniaController.registrarTelemetria); // Middleware adicionado aqui

module.exports = router;