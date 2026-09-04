const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');

router.post('/', manutencaoController.criar);
router.get('/', manutencaoController.listarComFiltros);
router.get('/busca-placa', manutencaoController.buscarPorPlaca); // Rota do Exercício 1
router.post('/:id/pecas', manutencaoController.adicionarPeca);    // Rota do Exercício 2
router.patch('/:id/status', manutencaoController.atualizarStatus);
router.delete('/:id', manutencaoController.excluir);

module.exports = router;
