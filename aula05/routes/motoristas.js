const express = require('express');
const router = express.Router();
const validaCnh = require('../middlewares/validaCnh'); // Importação correta saindo da pasta routes

let motoristas = [
        { id: 1, nome: "Carlos Silva", cnh: "12345678900", categoria: "E", ativo: true },
        { id: 2, nome: "Ana Pereira", cnh: "98765432100", categoria: "D", ativo: true }
];

// GET /api/v1/motoristas
router.get('/', (req, res) => {
        res.status(200).json(motoristas);
});

// POST /api/v1/motoristas (Com validaCnh inserido e bug do id corrigido)
router.post('/', validaCnh, (req, res) => {
        const { nome, cnh, categoria } = req.body;

        if (!nome || !cnh || !categoria) {
                return res.status(400).json({ erro: "Campos 'nome', 'cnh' e 'categoria' sao obrigatorios." });
        }

        // CORRIGIDO: Agora aponta para 'motoristas.length' com "s"
        const novoMotorista = {
                id: motoristas.length + 1,
                nome,
                cnh,
                categoria,
                ativo: true
        };

        motoristas.push(novoMotorista);
        res.status(201).json(novoMotorista);
});

module.exports = router;

