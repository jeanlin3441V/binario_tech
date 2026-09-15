require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // <-- LINHA QUE FALTAVA
const conectarBanco = require('./src/config/database');
const autenticar = require('./src/middlewares/autenticar');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.json({ status: "PRONTO_PARA_EXAME", timestamp: new Date() });
});

// Rota protegida
app.get('/api/v1/simulado/status', autenticar, (req, res) => {
  res.json({ mensagem: "Acesso autorizado no Servidor Local!", usuario: req.usuario });
});

// EXERCÍCIO 2: Gerar Token JWT de teste
app.post('/api/v1/auth/token-teste', (req, res) => {
  const payload = {
    id: "aluno_simulado_123",
    nome: req.body.nome || "Jean Silva",
    funcao: "REVISAO_EXAME"
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'binario_tech_exame_2026_secreto', {
    expiresIn: '5m'
  });

  res.json({ token });
});

conectarBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`[Binário Tech] Servidor da Aula 17 ativo na porta ${PORT}`);
  });
});
