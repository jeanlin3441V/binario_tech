#!/bin/bash

echo "=== [$(date)] Testando /status ==="
curl -s http://localhost:3013/status | jq .
echo -e "\n"

echo "=== [$(date)] Testando /scania/info ==="
curl -s http://localhost:3013/scania/info | jq .
echo -e "\n"

echo "=== [$(date)] Testando /vw/info ==="
curl -s http://localhost:3013/vw/info | jq .
echo -e "\n"
