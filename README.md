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
