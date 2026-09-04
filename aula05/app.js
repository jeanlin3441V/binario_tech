const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./routes/motoristas');
const motoristasRouter = require('./routes/motoristas');
const manutencoesRouter = require('./routes/manutencoes');

const app = express();
const PORT = 3000;

// middleares globais
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Rota Publica
app.get('/api/v1/health', (req, res) => {
	res.status(200).json({ status: "ONLINE", aplicacao: "Binario Tech API v2" });
})

// Rotas protegidas por Autenticacao
app.use('/api/v1/motoristas', authMiddleware, motoristasRouter);

app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);

// Middleware global de tratamento de erros 404 (rota nao encontrada)
app.use ((req, res) => {
	res.status(404).json({ erro: "Endpoint nao encontrado no servidor Binario Tech." });
});

app.listen(PORT	, () => {
	console.log(`[Binario Tech] Servidor de Middlewares ativo na porta ${PORT}`);
});
