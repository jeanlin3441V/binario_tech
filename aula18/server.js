const express = require('express');
const cors = require('cors');
require('dotenv').config();

const conectarBanco = require('./src/config/database');
const provaRoutes = require('./src/routes/provaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/prova', provaRoutes);

conectarBanco().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Servidor Aula 18 rodando na porta ${process.env.PORT}`);
  });
});

