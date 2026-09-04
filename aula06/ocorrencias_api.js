const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const ARQUIVO_DADOS = path.join(__dirname, 'ocorrencias.json');

app.use(cors());
app.use(express.json());

// Funcao Auxiliar: Ler arquivo JSON
async function lerOcorrencias() {
	try {
		const dados = await fs.readFile(ARQUIVO_DADOS, 'utf-8');
		return JSON.parse(dados);
	} catch (erro) {
		// Se o arquivo nao existir, reotrnar array vazio e cria o arquivo
		await fs.writeFile(ARQUIVO_DADOS, '[]', 'utf-8');
		return [];
	}
}

// Funcao Auxiliar : Salvar no arquivo JSON
async function salvarOcorrencias(ocorrencias) {
	await fs.writeFile(ARQUIVO_DADOS, JSON.stringify(ocorrencias, null, 2), 'utf-8');
}

// Rota 1: Listar todas as ocorrencias
app.get('/api/v1/ocorrencias', async (req, res) => {
	try {
		const ocorrencias = await lerOcorrencias();
		res.status(200).json(ocorrencias);
	} catch (erro) {
		res.status(500).json({ erro: "Erro ao ler base de dados em disco." });
	}
});

app.get('/api/v1/ocorrencias/montadora/:nome', async (req, res) => {
        try {
                const { nome } = req.params;
                const ocorrencias = await lerOcorrencias();

                const filtradas = ocorrencias.filter(o => 
                        o.montadora.toLowerCase() === nome.toLowerCase()
                );

                res.status(200).json(filtradas);
        } catch (erro) {
                res.status(500).json({ erro: "Erro ao filtrar ocorrências por montadora." });
        }
});

// Rota 2: Cadastrar nova ocorrencia na frota
app.post('/api/v1/ocorrencias', async (req, res) => {
	try {
		const { montadora, placa, descricao, gravidade } = req.body;

		if (!montadora || !placa || !descricao) {
			return res.status(400).json({ erro: "Montadora, placa e descricao são obrigatorios."});
	}

	const ocorrencias = await lerOcorrencias();
	const novaOcorrencia = {
		id: Date.now(),
		montadora,
		placa,
		descricao,
		gravidade: gravidade || "MEDIA",
		data_registro: new Date().toISOString()
	};

	ocorrencias.push(novaOcorrencia);
	await salvarOcorrencias(ocorrencias);
	
	res.status(201).json(novaOcorrencia);
	} catch (erro) {
		res.status(500).json({ erro: "Erro ao salvar ocorrência em disco." });
	}
});

app.delete('/api/v1/ocorrencias/:id', async (req, res) => {
        try {
                const { id } = req.params;
                const ocorrencias = await lerOcorrencias();

                const ocorrenciaExiste = ocorrencias.some(o => o.id === Number(id));

                if (!ocorrenciaExiste) {
                        return res.status(404).json({ erro: "Ocorrência não encontrada." });
                }

                const ocorrenciasFiltradas = ocorrencias.filter(o => o.id !== Number(id));
                await salvarOcorrencias(ocorrenciasFiltradas);

                res.status(200).json({ mensagem: `Ocorrência com ID ${id} removida com sucesso.` });
        } catch (erro) {
                res.status(500).json({ erro: "Erro ao tentar remover a ocorrência do disco." });
        }
});

app.listen(PORT, () => {
	console.log(`[Binario Tech] API de Ocorrencias ativa na porta ${PORT}`);
});

		
