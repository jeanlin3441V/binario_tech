# Aula 03 — Múltiplos servidores e portas

> A porta deste servidor é a **3000**, igual ao resto do projeto.

## [PASSO 1] Preparação do Ambiente de Trabalho

Execute os comandos abaixo no terminal:

```bash
cd ~/binario_tech
mkdir -p aula03
cd aula03
npm init -y
npm install express
sudo apt-get update && sudo apt-get install -y jq httpie
```

## [PASSO 2] Criação do Servidor de Telemetria (`telemetria.js`)

Crie o arquivo `telemetria.js` com o seguinte conteúdo:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Rota Scania
app.get('/api/v1/scania', (req, res) => {
    res.json({ montadora: "Scania", modelo: "R450", status: "OK", conexao: true, velocidade_media: 82 });
});

// Rota Mercedes-Benz
app.get('/api/v1/mercedes', (req, res) => {
    res.json({ montadora: "Mercedes-Benz", modelo: "Actros", status: "OK", conexao: true, velocidade_media: 78 });
});

// Rota Volkswagen
app.get('/api/v1/vw', (req, res) => {
    res.json({ montadora: "Volkswagen", modelo: "Delivery", status: "ALERTA", conexao: false, velocidade_media: 0 });
});

// Rota Volvo
app.get('/api/v1/volvo', (req, res) => {
    res.json({ montadora: "Volvo", modelo: "FH 540", status: "OK", conexao: true, velocidade_media: 80 });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] Servidor de Telemetria rodando em http://localhost:${PORT}`);
});
```

## [PASSO 3] Execução do Servidor em Segundo Plano

```bash
node telemetria.js &
```

## [PASSO 4] Criação do Script Bash de Automação (`testar_telemetria.sh`)

Crie o arquivo `testar_telemetria.sh` com o seguinte conteúdo:

```bash
#!/bin/bash

echo "========================================="
echo "  AUDITORIA DE TELEMETRIA - BINARIO TECH "
echo "  Data/Hora: $(date)"
echo "========================================="

echo -e "\n[1] Testando Rota Scania..."
curl -s http://localhost:3000/api/v1/scania | jq .

echo -e "\n[2] Testando Rota Mercedes-Benz..."
curl -s http://localhost:3000/api/v1/mercedes | jq .

echo -e "\n[3] Testando Rota Volkswagen..."
curl -s http://localhost:3000/api/v1/vw | jq .

echo -e "\n-----------------------------------------"
echo "Auditoria finalizada com sucesso!"
```

## [PASSO 5] Dar Permissão e Executar o Script

```bash
chmod +x testar_telemetria.sh
./testar_telemetria.sh
```

---

# Exercícios

## Exercício 1 — Filtrar `modelo` com jq

Execute:

```bash
curl -s http://localhost:3000/api/v1/scania | jq '.modelo'
```

**Resultado esperado:**

```text
"R450"
```

O `jq` foi usado para pegar somente o campo `modelo` da resposta da Scania.

---

## Exercício 2 — Usar httpie e salvar em arquivo

Execute:

```bash
http GET http://localhost:3000/api/v1/mercedes > mercedes.json
```

Esse comando faz uma requisição para a rota da Mercedes-Benz e salva o resultado no arquivo `mercedes.json`.

**Resultado esperado:**

O arquivo `mercedes.json` será criado na pasta `aula03`.

---

## Exercício 3 — Extrair `status` do arquivo salvo

Execute:

```bash
jq '.status' mercedes.json
```

**Resultado esperado:**

```text
"OK"
```

O `jq` lê o arquivo `mercedes.json` e mostra somente o campo `status`.

---

## Exercício 4 — Criar a rota `/api/v1/volvo`

A rota Volvo já está no código do `telemetria.js`.

Ela é:

```javascript
app.get('/api/v1/volvo', (req, res) => {
    res.json({ montadora: "Volvo", modelo: "FH 540", status: "OK", conexao: true, velocidade_media: 80 });
});
```

Teste a nova rota:

```bash
curl -s http://localhost:3000/api/v1/volvo | jq .
```

**Resultado esperado:**

```json
{
  "montadora": "Volvo",
  "modelo": "FH 540",
  "status": "OK",
  "conexao": true,
  "velocidade_media": 80
}
```

---

## Exercício 5 — Criar o script `"start"` no package.json

No arquivo `package.json`, coloque:

```json
"scripts": {
  "start": "node telemetria.js"
}
```

Depois execute:

```bash
npm start
```

**Resultado esperado:**

O servidor será iniciado pela configuração do `package.json`.

A mensagem será parecida com:

```text
[Binario Tech] Servidor de Telemetria rodando em http://localhost:3000
```

---

## Exercício 6 — Redirecionar a auditoria para um arquivo de log

Execute:

```bash
bash testar_telemetria.sh > relatorio.log
```

Esse comando executa o script e salva a saída no arquivo `relatorio.log`.

Para visualizar:

```bash
cat relatorio.log
```

**Resultado esperado:**

O arquivo `relatorio.log` terá os resultados das rotas Scania, Mercedes-Benz e Volkswagen.

---

## Exercício 7 — Filtrar dois campos com jq

Execute:

```bash
curl -s http://localhost:3000/api/v1/vw | jq '{montadora, status}'
```

**Resultado esperado:**

```json
{
  "montadora": "Volkswagen",
  "status": "ALERTA"
}
```

Nesse exercício o `jq` mostra somente os campos `montadora` e `status`.

---

## Exercício 8 — Localizar e finalizar o processo Node.js

Para localizar o processo:

```bash
ps aux | grep node
```

Depois, use o PID encontrado:

```bash
kill -9 <PID>
```

**Resultado esperado:**

O processo do servidor Node.js será encerrado.

Depois disso, as requisições para:

```text
http://localhost:3000
```

não funcionarão até o servidor ser iniciado novamente.

# Aula 04 — Arquitetura HTTP, Rotas e APIs RESTful

> Nesta aula foi criada uma API de gerenciamento de frotas usando Node.js e Express, trabalhando com os métodos HTTP e os códigos de status. A porta utilizada é a **3000**.

## [PASSO 1] Preparação do Ambiente de Trabalho

Execute os comandos abaixo no terminal:

```bash
cd ~/binario_tech
mkdir -p aula04
cd aula04
npm init -y
npm install express
sudo apt-get update && sudo apt-get install -y jq httpie
```

## [PASSO 2] Criação do Servidor de Gestão de Frotas (`frota_api.js`)

Crie o arquivo `frota_api.js` com o seguinte conteúdo:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Banco de dados em memoria
let veiculos = [
    { id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
    { id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

// GET - Listar todos os veiculos e filtrar por status
app.get('/api/v1/veiculos', (req, res) => {
    const { status } = req.query;

    if (status) {
        const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
        return res.status(200).json(filtrados);
    }

    res.status(200).json(veiculos);
});

// GET - Buscar veiculo por ID
app.get('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado na base de dados." });
    }

    res.status(200).json(veiculo);
});

// POST - Cadastrar novo veiculo
app.post('/api/v1/veiculos', (req, res) => {
    const { placa, montadora, modelo } = req.body;

    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }

    const novoVeiculo = {
        id: veiculos.length + 1,
        placa,
        montadora,
        modelo,
        status: "DISPONIVEL"
    };

    veiculos.push(novoVeiculo);
    res.status(201).json(novoVeiculo);
});

// PATCH - Atualizar status do veiculo
app.patch('/api/v1/veiculos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }

    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
    }

    veiculo.status = status.toUpperCase();

    res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

// DELETE - Remover veiculo da frota
app.delete('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = veiculos.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }

    veiculos.splice(index, 1);

    res.status(200).json({ mensagem: `Veiculo ID ${id} removido com sucesso.` });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`);
});
```

## [PASSO 3] Execução do Servidor e Testes HTTP

**1. Iniciar o servidor:**

```bash
node frota_api.js &
```

**2. Testar GET — Listagem dos veículos:**

```bash
curl -s http://localhost:3000/api/v1/veiculos | jq .
```

**3. Testar POST — Cadastrar novo veículo:**

```bash
curl -i -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"placa":"VWX-5555","montadora":"Volkswagen","modelo":"Delivery"}'
```

**4. Testar PATCH — Atualizar status:**

```bash
curl -s -X PATCH http://localhost:3000/api/v1/veiculos/1/status \
-H "Content-Type: application/json" \
-d '{"status":"MANUTENCAO"}' | jq .
```

**5. Testar DELETE — Remover veículo:**

```bash
curl -s -X DELETE http://localhost:3000/api/v1/veiculos/2 | jq .
```

---

# Exercícios

## Exercício 1 — Buscar veículo por ID

Faça uma requisição GET para buscar somente o veículo de ID 1.

Execute:

```bash
curl -s http://localhost:3000/api/v1/veiculos/1 | jq .
```

**Resultado esperado:**

```json
{
  "id": 1,
  "placa": "ABC-1234",
  "montadora": "Scania",
  "modelo": "R450",
  "status": "DISPONIVEL"
}
```

O `jq` organiza a resposta JSON para facilitar a leitura.

---

## Exercício 2 — Cadastrar um caminhão Volvo

Execute uma requisição POST para cadastrar um veículo da Volvo, modelo FH 540 e placa KLL-9090.

```bash
curl -i -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540"}'
```

**Resultado esperado:**

O veículo será cadastrado com o status `DISPONIVEL` e a resposta HTTP será `201 Created`.

---

## Exercício 3 — Testar validação de campos obrigatórios

Tente cadastrar um veículo sem informar a placa.

```bash
curl -i -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"montadora":"Volvo","modelo":"FH 540"}'
```

**Resultado esperado:**

```json
{
  "erro": "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios."
}
```

A API deve retornar o status `400 Bad Request`, pois o campo `placa` é obrigatório.

---

## Exercício 4 — Filtrar veículos usando Query Params

Faça uma requisição GET para listar somente os veículos com status `DISPONIVEL`.

```bash
curl -s "http://localhost:3000/api/v1/veiculos?status=DISPONIVEL" | jq .
```

**Resultado esperado:**

A API retornará somente os veículos que estiverem com o status `DISPONIVEL`.

O parâmetro `status` é utilizado para filtrar os resultados.

---

## Exercício 5 — Atualizar status com PATCH

Atualize o status do veículo de ID 3 para `EM_ROTA`.

```bash
curl -s -X PATCH http://localhost:3000/api/v1/veiculos/3/status \
-H "Content-Type: application/json" \
-d '{"status":"EM_ROTA"}' | jq .
```

**Resultado esperado:**

```json
{
  "mensagem": "Status atualizado com sucesso!",
  "veiculo": {
    "id": 3,
    "placa": "KLL-9090",
    "montadora": "Volvo",
    "modelo": "FH 540",
    "status": "EM_ROTA"
  }
}
```

O método PATCH altera somente o status do veículo, sem substituir os outros dados.

---

## Exercício 6 — Testar ID inexistente

Tente buscar um veículo com ID 99, que não existe na lista.

```bash
curl -i http://localhost:3000/api/v1/veiculos/99
```

Também é possível testar a exclusão de um ID inexistente:

```bash
curl -i -X DELETE http://localhost:3000/api/v1/veiculos/99
```

**Resultado esperado:**

```json
{
  "erro": "Veiculo nao encontrado."
}
```

A API deve retornar `404 Not Found` quando o veículo não for encontrado.

---

## Exercício 7 — Criar uma rota PUT

O método PUT permite substituir os dados de um veículo de uma só vez.

Adicione o código abaixo em `frota_api.js`, antes da rota DELETE:

```javascript
// PUT - Substituir todos os dados do veiculo
app.put('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { placa, montadora, modelo, status } = req.body;

    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }

    if (!placa || !montadora || !modelo || !status) {
        return res.status(400).json({
            erro: "Os campos placa, montadora, modelo e status sao obrigatorios."
        });
    }

    veiculo.placa = placa;
    veiculo.montadora = montadora;
    veiculo.modelo = modelo;
    veiculo.status = status.toUpperCase();

    res.status(200).json({
        mensagem: "Veiculo atualizado com sucesso!",
        veiculo
    });
});
```

Depois de salvar o arquivo, reinicie o servidor para carregar a nova rota.

Teste a atualização do veículo de ID 1:

```bash
curl -s -X PUT http://localhost:3000/api/v1/veiculos/1 \
-H "Content-Type: application/json" \
-d '{"placa":"ABC-1234","montadora":"Scania","modelo":"R500","status":"DISPONIVEL"}' | jq .
```

**Resultado esperado:**

O modelo do veículo de ID 1 será alterado para `R500`, e a API retornará a mensagem de atualização com sucesso.

---

## Exercício 8 — Criar script Bash para testar o CRUD

Crie o arquivo `teste_crud.sh`:

```bash
nano teste_crud.sh
```

Coloque o seguinte conteúdo:

```bash
#!/bin/bash

echo "========================================="
echo "  TESTE CRUD - BINARIO TECH"
echo "  Data/Hora: $(date)"
echo "========================================="

echo -e "\n[1] Cadastrando primeiro veiculo..."
curl -s -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"placa":"AAA-1111","montadora":"Scania","modelo":"R450"}' | jq .

echo -e "\n[2] Cadastrando segundo veiculo..."
curl -s -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"placa":"BBB-2222","montadora":"Volvo","modelo":"FH 540"}' | jq .

echo -e "\n[3] Atualizando status do veiculo ID 3..."
curl -s -X PATCH http://localhost:3000/api/v1/veiculos/3/status \
-H "Content-Type: application/json" \
-d '{"status":"EM_ROTA"}' | jq .

echo -e "\n[4] Removendo veiculo ID 4..."
curl -s -X DELETE http://localhost:3000/api/v1/veiculos/4 | jq .

echo -e "\n-----------------------------------------"
echo "Teste CRUD finalizado!"
```

Dê permissão para executar o script:

```bash
chmod +x teste_crud.sh
```

Execute o script e salve os resultados no arquivo de log:

```bash
./teste_crud.sh > crud_result.log 2>&1
```

Para visualizar o resultado:

```bash
cat crud_result.log
```

**Resultado esperado:**

O arquivo `crud_result.log` terá as respostas das operações de cadastro, atualização e exclusão.

**Observação:** para que os IDs 3 e 4 correspondam aos veículos cadastrados pelo script, execute-o com a API reiniciada e os dados iniciais carregados, sem outros cadastros anteriores nessa execução.

---

## Comandos úteis

| Comando | Para que serve |
|---|---|
| `node frota_api.js &` | Inicia o servidor em segundo plano |
| `curl -s URL \| jq .` | Exibe o JSON formatado |
| `curl -i URL` | Exibe a resposta e o status HTTP |
| `curl -X POST` | Cadastra um recurso |
| `curl -X PATCH` | Atualiza parte de um recurso |
| `curl -X PUT` | Substitui os dados de um recurso |
| `curl -X DELETE` | Remove um recurso |
| `chmod +x arquivo.sh` | Dá permissão de execução ao script |
| `cat crud_result.log` | Exibe o arquivo de log |
| `ps aux \| grep node` | Localiza processos Node.js |

## Resumo das rotas

| Método | Rota | Função |
|---|---|---|
| GET | `/api/v1/veiculos` | Lista os veículos |
| GET | `/api/v1/veiculos/:id` | Busca veículo por ID |
| POST | `/api/v1/veiculos` | Cadastra veículo |
| PATCH | `/api/v1/veiculos/:id/status` | Atualiza o status |
| PUT | `/api/v1/veiculos/:id` | Substitui os dados do veículo |
| DELETE | `/api/v1/veiculos/:id` | Remove veículo |

## Códigos de status HTTP utilizados

- `200 OK` — Requisição realizada com sucesso.
- `201 Created` — Veículo cadastrado com sucesso.
- `400 Bad Request` — Dados obrigatórios não informados.
- `404 Not Found` — Veículo não encontrado.

# Aula 05 — PBE1 | Binário Tech

**Conteúdo:** Middlewares, rotas, autenticação por API Key, CORS e tratamento de erros.

## 1. Criar o projeto

```bash
cd ~/binario_tech
mkdir -p aula05/routes aula05/middlewares
cd aula05
npm init -y
npm install express cors
```

## 2. Estrutura de pastas

```text
aula05/
├── app.js
├── package.json
├── routes/
│   ├── motoristas.js
│   └── manutencoes.js
└── middlewares/
    ├── logger.js
    ├── auth.js
    └── validaCnh.js
```

Criar os arquivos:

```bash
touch app.js routes/motoristas.js routes/manutencoes.js
touch middlewares/logger.js middlewares/auth.js middlewares/validaCnh.js
touch teste_seguranca.sh
```

## 3. Logger — `middlewares/logger.js`

```javascript
function loggerMiddleware(req, res, next) {
    const inicio = Date.now();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const duracao = Date.now() - inicio;
        console.log(
            `[LOG ${timestamp}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duracao}ms)`
        );
    });

    next();
}

module.exports = loggerMiddleware;
```

## 4. Autenticação — `middlewares/auth.js`

```javascript
function authMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const CHAVE_VALIDA = "binario-tech-secret-2026";

    if (!apiKey || apiKey !== CHAVE_VALIDA) {
        return res.status(401).json({
            erro: "Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."
        });
    }

    next();
}

module.exports = authMiddleware;
```

## 5. Validação da CNH — `middlewares/validaCnh.js`

```javascript
function validaCnh(req, res, next) {
    const { cnh } = req.body;

    if (typeof cnh !== 'string' || !/^\d{11}$/.test(cnh)) {
        return res.status(400).json({
            erro: "A CNH deve conter exatamente 11 digitos numericos."
        });
    }

    next();
}

module.exports = validaCnh;
```

## 6. Rotas de motoristas — `routes/motoristas.js`

```javascript
const express = require('express');
const validaCnh = require('../middlewares/validaCnh');
const router = express.Router();

let motoristas = [
    { id: 1, nome: "Carlos Silva", cnh: "12345678900", categoria: "E", ativo: true },
    { id: 2, nome: "Ana Pereira", cnh: "98765432100", categoria: "D", ativo: true }
];

router.get('/', (req, res) => {
    res.status(200).json(motoristas);
});

router.post('/', validaCnh, (req, res) => {
    const { nome, cnh, categoria } = req.body;

    if (!nome || !cnh || !categoria) {
        return res.status(400).json({
            erro: "Campos 'nome', 'cnh' e 'categoria' sao obrigatorios."
        });
    }

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
```

## 7. Rotas de manutenções — `routes/manutencoes.js`

```javascript
const express = require('express');
const router = express.Router();

let manutencoes = [
    {
        id: 1,
        caminhao: "Caminhao 01",
        descricao: "Troca de oleo e filtros",
        valor: 850,
        status: "ORCAMENTO"
    },
    {
        id: 2,
        caminhao: "Caminhao 02",
        descricao: "Manutencao dos freios",
        valor: 1200,
        status: "ORCAMENTO"
    }
];

router.get('/', (req, res) => {
    res.status(200).json(manutencoes);
});

router.post('/', (req, res) => {
    const { caminhao, descricao, valor } = req.body;

    if (!caminhao || !descricao || valor === undefined ||
        valor === null || valor === '') {
        return res.status(400).json({
            erro: "Campos 'caminhao', 'descricao' e 'valor' sao obrigatorios."
        });
    }

    const novaManutencao = {
        id: manutencoes.length + 1,
        caminhao,
        descricao,
        valor,
        status: "ORCAMENTO"
    };

    manutencoes.push(novaManutencao);
    res.status(201).json(novaManutencao);
});

module.exports = router;
```

## 8. Servidor principal — `app.js`

```javascript
const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');
const motoristasRouter = require('./routes/motoristas');
const manutencoesRouter = require('./routes/manutencoes');

const app = express();
const PORT = 3016;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: "ONLINE",
        aplicacao: "Binario Tech API v2"
    });
});

app.use('/api/v1/motoristas', authMiddleware, motoristasRouter);
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);

app.use((req, res) => {
    res.status(404).json({
        erro: "Endpoint nao encontrado no servidor Binario Tech."
    });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] Servidor de Middlewares ativo na porta ${PORT}`);
});
```

## 9. Executar e testar a API

Iniciar:

```bash
node app.js
```

### Health Check — Exercício 01

```bash
curl -i http://localhost:3016/api/v1/health
```

Esperado: `200 OK`. Confira também o log no terminal do servidor.

### Listar motoristas

```bash
curl -i -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3016/api/v1/motoristas
```

### Cadastrar motorista

```bash
curl -i -X POST http://localhost:3016/api/v1/motoristas \
-H "X-API-KEY: binario-tech-secret-2026" \
-H "Content-Type: application/json" \
-d '{"nome":"Roberto Souza","cnh":"55544433322","categoria":"E"}'
```

Esperado: `201 Created`.

### Testar autenticação — Exercício 03

Sem chave:

```bash
curl -i http://localhost:3016/api/v1/manutencoes
```

Esperado: `401 Unauthorized`.

Com chave:

```bash
curl -i -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3016/api/v1/manutencoes
```

Esperado: `200 OK`.

### Listar manutenções — Exercício 02

```bash
curl -i -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3016/api/v1/manutencoes
```

### Cadastrar manutenção

```bash
curl -i -X POST http://localhost:3016/api/v1/manutencoes \
-H "X-API-KEY: binario-tech-secret-2026" \
-H "Content-Type: application/json" \
-d '{"caminhao":"Caminhao 03","descricao":"Revisao do motor","valor":1500}'
```

Esperado: `201 Created`.

## 10. Exercício 04 — Criar validação da CNH

O código está no arquivo `middlewares/validaCnh.js`, na seção 5.

A expressão `/^\d{11}$/` exige exatamente 11 dígitos numéricos.

## 11. Exercício 05 — Testar CNH inválida

```bash
curl -i -X POST http://localhost:3016/api/v1/motoristas \
-H "X-API-KEY: binario-tech-secret-2026" \
-H "Content-Type: application/json" \
-d '{"nome":"Roberto Souza","cnh":"123","categoria":"E"}'
```

Esperado: `400 Bad Request`.

A rota POST precisa conter:

```javascript
router.post('/', validaCnh, (req, res) => {
```

## 12. Exercício 06 — Testar erro 404

```bash
curl -i http://localhost:3016/api/v1/clientes
```

Esperado: `404 Not Found`.

O middleware de 404 deve ficar depois de todas as rotas no `app.js`.

## 13. Exercício 07 — Script de segurança

Criar o arquivo:

```bash
nano teste_seguranca.sh
```

Código:

```bash
#!/bin/bash

URL="http://localhost:3016/api/v1/motoristas"
ARQUIVO="audit_seguranca.log"

echo "Inicio dos testes: $(date)" > "$ARQUIVO"

for i in 1 2 3
do
    echo "Tentativa $i sem API Key" >> "$ARQUIVO"
    curl -s -o /dev/null -w "HTTP %{http_code}\n" \
    "$URL" >> "$ARQUIVO"
done

echo "Tentativa com API Key valida" >> "$ARQUIVO"

curl -s -o /dev/null -w "HTTP %{http_code}\n" \
-H "X-API-KEY: binario-tech-secret-2026" \
"$URL" >> "$ARQUIVO"

cat "$ARQUIVO"
```

Executar:

```bash
chmod +x teste_seguranca.sh
./teste_seguranca.sh
cat audit_seguranca.log
```

Esperado: três respostas `401` e uma resposta `200`.

## 14. Exercício 08 — Encerrar o servidor

Encontrar o processo:

```bash
ps aux | grep node
```

Encerrar pelo PID correto:

```bash
kill PID
```

Se necessário:

```bash
kill -9 PID
```

Substitua `PID` pelo número real do processo.

## 15. Comandos úteis

```bash
ls -R
```

Editar arquivos:

```bash
nano app.js
nano routes/motoristas.js
nano routes/manutencoes.js
nano middlewares/logger.js
nano middlewares/auth.js
nano middlewares/validaCnh.js
nano teste_seguranca.sh
```

Se o `jq` estiver instalado:

```bash
curl -s http://localhost:3016/api/v1/health | jq .
```

## 16. Códigos HTTP

| Código | Significado |
|---|---|
| `200` | Consulta realizada com sucesso |
| `201` | Cadastro realizado |
| `400` | Dados inválidos ou ausentes |
| `401` | API Key inválida ou ausente |
| `404` | Rota não encontrada |
| `500` | Erro interno do servidor |

## 17. Modelos para adaptar

### GET

```javascript
router.get('/', (req, res) => {
    res.status(200).json(dados);
});
```

### POST

```javascript
router.post('/', (req, res) => {
    const { campo1, campo2 } = req.body;

    if (!campo1 || !campo2) {
        return res.status(400).json({
            erro: "Campos obrigatorios."
        });
    }

    const novo = {
        id: dados.length + 1,
        campo1,
        campo2
    };

    dados.push(novo);
    res.status(201).json(novo);
});
```

### Criar roteador

```javascript
const express = require('express');
const router = express.Router();

// Rotas aqui

module.exports = router;
```

### Registrar rota protegida no `app.js`

```javascript
const exemploRouter = require('./routes/exemplo');

app.use('/api/v1/exemplo', authMiddleware, exemploRouter);
```

## 18. Resumo

- `req`: requisição.
- `res`: resposta.
- `next()`: passa o controle ao próximo middleware.
- `express.Router()`: organiza as rotas.
- `express.json()`: interpreta JSON.
- `cors()`: configura acesso entre origens.
- `req.body`: dados enviados pelo cliente.
- `req.headers['x-api-key']`: lê a API Key.
- `router.get('/')`: consulta dados.
- `router.post('/')`: cadastra dados.
- `module.exports`: exporta o módulo.
- `require()`: importa o módulo.
- Middleware de 404: fica no final do `app.js`.
- Porta da aplicação: `3016`.

**Observação:** o código implementa o tratamento de `404`, mas não possui um middleware global específico para erros internos `500`. Os dados ficam em memória e são perdidos quando o servidor reinicia.


