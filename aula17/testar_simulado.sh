#!/bin/bash
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/health)
echo "=== HEALTH CHECK SIMULADO - $(date) ===" > health_check.log
echo "HTTP Status Code: $STATUS_CODE" >> health_check.log
echo "Teste finalizado com código $STATUS_CODE."
