const express = require('express');
const router = express.Router();

// Simulando um banco de dados em memória
let manutencoes = [
    { id: 1, caminhaoId: 'ABC-1234', descricao: 'Troca de óleo e filtros', valor: 450.00, status: 'Aprovado' }
];

// GET: Listar todos os orçamentos de manutenção
router.get('/', (req, res) => {
    try {
        res.status(200).json(manutencoes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar manutenções.' });
    }
});

// POST: Cadastrar um novo orçamento de manutenção
router.post('/', (req, res) => {
    try {
        const { caminhaoId, descricao, valor, status } = req.body;

        // Validação simples dos campos obrigatórios
        if (!caminhaoId || !descricao || !valor) {
            return res.status(400).json({ erro: 'Campos obrigatórios: caminhaoId, descricao e valor.' });
        }

        const novaManutencao = {
            id: manutencoes.length + 1,
            caminhaoId,
            descricao,
            valor: parseFloat(valor),
            status: status || 'Pendente'
        };

        manutencoes.push(novaManutencao);
        res.status(201).json(novaManutencao);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao cadastrar manutenção.' });
    }
});

module.exports = router;

