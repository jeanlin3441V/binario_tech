const express = require('express');
const router = express.Router();
const veiculosController = require('../controllers/veiculosController');

router.get('/', veiculosController.listarTodos);
router.post('/', veiculosController.criar);

// EXERCÍCIO 1: Rota para buscar por ID
router.get('/:id', veiculosController.buscarPorId);

// EXERCÍCIO 2: Rota PATCH para atualizar status
router.patch('/:id/status', veiculosController.atualizarStatus);

module.exports = router;
