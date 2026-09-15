#!/bin/bash
echo "=== AUDITORIA DE PROCESSOS NODE.JS - $(date) ===" > processos.log
ps aux | grep node | grep -v grep >> processos.log
echo "Auditoria concluída com sucesso."
