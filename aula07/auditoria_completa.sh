#!/bin/bash

LOG_FILE="auditoria.log"

echo "===============================================" > "$LOG_FILE"
echo " EXECUÇÃO DE AUDITORIA DE SISTEMA - BINÁRIO TECH" >> "$LOG_FILE"
echo " Data: $(date)" >> "$LOG_FILE"
echo "===============================================" >> "$LOG_FILE"

echo -e "\n[1] Consultando Telemetria Scania..." >> "$LOG_FILE"
curl -s http://localhost:3000/api/v1/telemetria/scania | jq . >> "$LOG_FILE"

echo -e "\n[2] Consultando Telemetria Mercedes-Benz..." >> "$LOG_FILE"
curl -s http://localhost:3000/api/v1/telemetria/mercedes | jq . >> "$LOG_FILE"

echo -e "\n[3] Testando Registro Scania com VIN Válido..." >> "$LOG_FILE"
curl -s -X POST http://localhost:3000/api/v1/telemetria/scania \
  -H "Content-Type: application/json" \
  -d '{"modelo":"R540","vin":"9BS555444333","temperatura_motor":90}' | jq . >> "$LOG_FILE"

echo -e "\n[4] Testando Registro Scania com VIN Inválido (Middleware)..." >> "$LOG_FILE"
curl -s -X POST http://localhost:3000/api/v1/telemetria/scania \
  -H "Content-Type: application/json" \
  -d '{"modelo":"R540","vin":"12345","temperatura_motor":90}' | jq . >> "$LOG_FILE"

echo -e "\n[5] Testando Rota Inexistente (404)..." >> "$LOG_FILE"
curl -s http://localhost:3000/api/v1/telemetria/volvo | jq . >> "$LOG_FILE"

echo "Auditoria concluída! Resultados salvos em $LOG_FILE"