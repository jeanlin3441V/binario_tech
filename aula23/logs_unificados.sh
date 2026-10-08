#!/bin/bash
echo "=== Monitorando logs unificados da API e Redis (Ctrl+C para sair) ==="
docker compose logs -f --tail=20
