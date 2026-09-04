#!/bin/bash

# Inicializa ou limpa o arquivo de log com cabeçalho de data
echo "=== AUDITORIA DE SEGURANÇA - $(date) ===" > audit_seguranca.log

echo "Executando 3 tentativas inválidas (Sem chave de API)..."
for i in {1..3}
do
   echo -e "\n[Tentativa Inválida $i]" >> audit_seguranca.log
   # Envia requisição sem token e joga a resposta no log
   curl -s -X GET http://localhost:3000/api/v1/manutencoes >> audit_seguranca.log
done

echo "Executando 1 tentativa válida (Com chave de API)..."
echo -e "\n[Tentativa Válida]" >> audit_seguranca.log

# NOTA: Ajuste o header de acordo com a validação real do seu authMiddleware.
# Se o seu authMiddleware exigir 'X-API-Key' ou 'Authorization', ajuste abaixo.
curl -s -X GET http://localhost:3000/api/v1/manutencoes \
-H "Authorization: Bearer chave_valida" >> audit_seguranca.log

echo "Testes concluídos! Resultados salvos no arquivo 'audit_seguranca.log'."

