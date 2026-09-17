#!/bin/bash

BASE_URL="http://localhost:3127/api/v1/prova"
EMAIL="teste@prova.com"
SENHA="123456"

echo "=== CADASTRO ==="

curl -s -X POST "$BASE_URL/register" \
	-H "Content-Type: application/json" \
	-d "{\"email\":\"$EMAIL\",\"senha\":\"$SENHA\"}" | jq

echo "=== LOGIN ==="

RESPOSTA=$(curl -s -X POST "$BASE_URL/login" \
-H "Content-Type: application/json" \
-d "{\"email\":\"$EMAIL\",\"senha\":\"$SENHA\"}")

echo "$RESPOSTA" | jq

TOKEN=$(echo "$RESPOSTA" | jq -r '.token')

echo ""
echo "=== RELATÓRIO PROTEGIDO ==="

curl -s -X GET "$BASE_URL/relatorio" \
-H "Authorization: Bearer $TOKEN" | jq

