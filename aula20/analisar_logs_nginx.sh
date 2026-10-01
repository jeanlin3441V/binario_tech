#!/bin/bash
echo "=================================================="
echo "    AUDITORIA DE LOGS NGINX (STATUS 200 OK)"
echo "=================================================="

LOG_FILE="/var/log/nginx/access.log"

if [ -f "$LOG_FILE" ]; then
  echo "Exibindo as últimas requisições com retorno 200 OK:"
  echo "--------------------------------------------------"
  tail -n 15 "$LOG_FILE" | grep " 200 "
else
  echo "[ERRO] Arquivo de log não encontrado em $LOG_FILE"
fi

echo "=================================================="
