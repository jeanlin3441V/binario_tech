#!/bin/bash
echo "===================================================="
echo " AUDITORIA DE BANCO DE DADOS SQLITE - BINÁRIO TECH"
echo "===================================================="

echo -e "\n[1] Cadastrando veículo Scania..."
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"SCA-2026","montadora":"Scania","modelo":"R500"}' | jq .

echo -e "\n[2] Cadastrando veículo Mercedes-Benz..."
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"MBB-2026","montadora":"Mercedes-Benz","modelo":"Actros 2651"}' | jq .

echo -e "\n[3] Listando todos os veículos gravados no banco relacional..."
curl -s http://localhost:3000/api/v1/veiculos | jq .

[PASSO 12] Dar permissão de execução e rodar o teste:
$ chmod +x testar_banco.sh

Execute em uma aba 'node server.js' e na outra './testar_banco.sh'.
