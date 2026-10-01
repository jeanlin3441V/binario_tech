#!/bin/bash
echo "=================================================="
echo "   LIMPEZA DE AMBIENTE DOCKER - BINÁRIO TECH"
echo "=================================================="

echo "[1/2] Removendo containers inativos/parados..."
docker container prune -f

echo "[2/2] Removendo imagens pendentes (dangling)..."
docker image prune -f --filter "dangling=true"

echo "=================================================="
echo "Limpeza de ambiente concluída!"
