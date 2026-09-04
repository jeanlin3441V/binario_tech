const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
  equipamentoId: {
    type: String,
    required: [true, 'O ID do equipamento é obrigatório']
  },
  nivelSeveridade: { // Corrigido erro de digitação (nicel -> nivel)
    type: String,
    enum: ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'], // Incluído 'ALTO'
    default: 'MEDIO'
  },
  temperaturaMedida: {
    type: Number,
    required: true
  },
  tags: [{ type: String }], // EXERCÍCIO 2: Array de Strings para marcadores
  metadados: {
    type: Map,
    of: String
  },
  registradoEm: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alerta', alertaSchema);
