#!/bin/bash

echo "==================================================="
echo " Resetando o ambiente de testes - Binario Tech "
echo "==================================================="

# 1. Encontrar e encerrar o processo Node.js usando o comando fuser
echo " Verificando se há processos na porta 3000..."
fuser -k 3000/tcp 2>/dev/null

if [ $? -eq 0 ]; then
    echo " Processo Node.js na porta 3000 encerrado com sucesso."
else
    echo " Nenhum processo Node.js rodando na porta 3000 foi encontrado."
fi

# 2. Excluir o arquivo de dados ocorrencias.json se ele existir
if [ -f "ocorrencias.json" ]; then
    echo " Excluindo arquivo ocorrencias.json..."
    rm ocorrencias.json
    echo "✔ Ambiente resetado com sucesso!"
else
    echo " Arquivo ocorrencias.json não existia no diretório."
    echo "✔ Ambiente já estava limpo!"
fi
echo "==================================================="
