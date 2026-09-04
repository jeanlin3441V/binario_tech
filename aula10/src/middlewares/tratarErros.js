function tratarErros(err, req, res, next) {
    console.error(`[ERRO LOG]: ${err.message}`);

    // 1. Verificação para erro de sintaxe no JSON enviado (Body Parser)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            erro: "O formato do JSON enviado na requisição é inválido. Verifique a sintaxe."
        });
    }

    // 2. Chave Única (ex: Placa duplicada)
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
            erro: "Conflito de dados: Registro já existe com este valor único (ex: Placa)."
        });
    }

    // 3. Chave Estrangeira (ex: veiculo_id inexistente) - Corrigido sem o sublinhado
    if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
        return res.status(400).json({
            erro: "Erro de relacionamento: O registro pai fornecido não existe."
        });
    }

    // 4. Erro genérico
    return res.status(500).json({
        erro: "Erro interno no servidor da Binário Tech."
    });
}

module.exports = tratarErros;















