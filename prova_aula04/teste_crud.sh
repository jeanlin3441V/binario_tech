#!/bin/bash

echo "========================================="
echo "  TESTE CRUD - BINARIO TECH"
echo "  Data/Hora: $(date)"
echo "========================================="

echo -e "\n[1] Cadastrando primeiro veiculo..."
curl -s -X POST http://localhost:3016/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"placa":"AAA-1111","montadora":"Scania","modelo":"R450"}' | jq .

echo -e "\n[2] Cadastrando segundo veiculo..."
curl -s -X POST http://localhost:3016/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"placa":"BBB-2222","montadora":"Volvo","modelo":"FH 540"}' | jq .

echo -e "\n[3] Atualizando status do veiculo ID 3..."
curl -s -X PATCH http://localhost:3016/api/v1/veiculos/3/status \
-H "Content-Type: application/json" \
-d '{"status":"EM_ROTA"}' | jq .

echo -e "\n[4] Removendo veiculo ID 4..."
curl -s -X DELETE http://localhost:3016/api/v1/veiculos/4 | jq .

echo -e "\n-----------------------------------------"
echo "Teste CRUD finalizado!"
