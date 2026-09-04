const db = require('../database/connection');

const veiculosController = {
  // Listar todos
  listarTodos: async (req, res) => {
    try {
      const veiculos = await db('veiculos').select('*');
      res.status(200).json(veiculos);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao consultar banco de dados." });
    }
  },

  // Criar novo
  criar: async (req, res) => {
    try {
      const { placa, montadora, modelo } = req.body;

      if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' são obrigatórios." });
      }

      const [id] = await db('veiculos').insert({ placa, montadora, modelo });
      const novoVeiculo = await db('veiculos').where('id', id).first();
      res.status(201).json(novoVeiculo);
    } catch (erro) {
      if (erro.message.includes('UNIQUE constraint failed') || erro.message.includes('UNIQUE')) {
        return res.status(409).json({ erro: "Já existe um veículo cadastrado com esta placa." });
      }
      res.status(500).json({ erro: "Erro ao inserir veículo no banco de dados." });
    }
  },

  // EXERCÍCIO 1: Buscar veículo por ID
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const veiculo = await db('veiculos').where({ id }).first();

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado." });
      }

      res.status(200).json(veiculo);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao buscar veículo por ID." });
    }
  },

  // EXERCÍCIO 2: Atualizar o status do veículo
  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ erro: "O campo 'status' é obrigatório." });
      }

      const veiculoExiste = await db('veiculos').where({ id }).first();
      if (!veiculoExiste) {
        return res.status(404).json({ erro: "Veículo não encontrado." });
      }

      await db('veiculos').where({ id }).update({ status });
      const veiculoAtualizado = await db('veiculos').where({ id }).first();

      res.status(200).json(veiculoAtualizado);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao atualizar status do veículo." });
    }
  }
};

module.exports = veiculosController;
