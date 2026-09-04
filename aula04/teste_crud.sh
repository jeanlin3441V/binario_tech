#!/bin/bash

# Define o arquivo de log e limpa conteúdos anteriores
LOG_FILE="crud_result.log"
> "$LOG_FILE"

echo "=== INICIANDO BATERIA DE TESTES CRUD ===" | tee -a "$LOG_FILE"
echo "Data/Hora: $(date)" | tee -a "$LOG_FILE"
echo "----------------------------------------" | tee -a "$LOG_FILE"

# 1. Cadastrar Veículo 1 (Volvo)
echo -e "\n[1/4] Cadastrando primeiro veículo (Volvo)..." | tee -a "$LOG_FILE"
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Volvo", "modelo": "FH 540", "placa": "KLL-9090"}' | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"

# 2. Cadastrar Veículo 2 (DAF)
echo -e "\n[2/4] Cadastrando segundo veículo (DAF)..." | tee -a "$LOG_FILE"
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "DAF", "modelo": "XF 530", "placa": "DAF-2024"}' | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"

# 3. Atualizar status do primeiro veículo cadastrado (ID 3) para EM_ROTA
echo -e "\n[3/4] Atualizando status do veículo ID 3..." | tee -a "$LOG_FILE"
curl -s -X PATCH http://localhost:3000/api/v1/veiculos/3/status \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}' | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"

# 4. Deletar o segundo veículo cadastrado (ID 4)
echo -e "\n[4/4] Deletando veículo ID 4..." | tee -a "$LOG_FILE"
curl -s -X DELETE http://localhost:3000/api/v1/veiculos/4 | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo -e "\n----------------------------------------" | tee -a "$LOG_FILE"
echo "=== BATERIA DE TESTES FINALIZADA ===" | tee -a "$LOG_FILE"
