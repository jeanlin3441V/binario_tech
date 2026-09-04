#!/bin/bash
echo "===================================================="
echo " AUDITORIA DE SEEDS E TRATAMENTO DE ERROS - AULA 10"
echo "===================================================="

echo -e "\n[1] Consultando dados pré-populares pelo Seed..."
curl -s http://localhost:3000/api/v1/frota | jq .

echo -e "\n[2] Testando erro de placa duplicada (Conflito - Status 409)..."
curl -s -X POST http://localhost:3000/api/v1/frota/veiculo \ -H "Content-Type: application/json" \ -d '{"placa":"VOL-1010","monatadora":"Volvo","modelo":"FH540"}' | jq .
