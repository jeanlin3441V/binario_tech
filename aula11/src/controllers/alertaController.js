const Alerta = require('../models/Alerta');

const alertaController = {
  // Salvar novo documento BSON
  criarAlerta: async (req, res) => {
    try {
      const { equipamentoId, veiculoPlaca, nivelSeveridade, temperaturaMedida, tags, metadados } = req.body;

      const novoAlerta = await Alerta.create({
        equipamentoId,
        veiculoPlaca,
        nivelSeveridade,
        temperaturaMedida,
        tags,
        metadados
      });

      res.status(201).json(novoAlerta); // Corrigido de .josn para .json
    } catch (erro) {
      res.status(400).json({ erro: "Erro ao salvar alerta no MongoDB", detalhe: erro.message });
    }
  },

  // Listar todos os alertas registrados
  listarAlertas: async (req, res) => {
    try {
      const alertas = await Alerta.find().sort({ registradoEm: -1, createdAt: -1 });
      res.status(200).json(alertas);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao consultar coleção no MongoDB" });
    }
  },

  // EXERCÍCIO 1: Buscar Alertas por Severidade (/api/v1/alertas/severidade/:nivel)
  buscarPorSeveridade: async (req, res) => {
    try {
      const { nivel } = req.params;

      const alertas = await Alerta.find({
        nivelSeveridade: nivel.toUpperCase()
      });

      res.status(200).json(alertas);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao buscar alertas por severidade.", detalhe: erro.message });
    }
  }
};

module.exports = alertaController;
