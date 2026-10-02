const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');
const motoristasRouter = require('./routes/motoristas');
const manutencoesRouter = require('./routes/manutencoes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: "ONLINE", aplicacao: "Binario Tech API v2" });
});

// Autenticação aplicada para as duas rotas
app.use('/api/v1/motoristas', authMiddleware, motoristasRouter);
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);

app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint nao encontrado no servidor Binario Tech." });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] Servidor ativo na porta ${PORT}`);
});
