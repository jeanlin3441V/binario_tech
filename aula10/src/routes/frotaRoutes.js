const express = require('express');
const router = express.Router();
const frotaController = require('../controllers/frotaController');

// Mudado de 'listarTudo' para 'ListarTudo' para bater com o controller
router.get('/', frotaController.ListarTudo);
router.post('/veiculo', frotaController.cadastrarVeiculo);

module.exports = router;
