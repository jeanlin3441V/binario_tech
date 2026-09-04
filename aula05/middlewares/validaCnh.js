// middlewares/validaCnh.js

const validaCnh = (req, res, next) => {
    const { cnh } = req.body;

    if (!cnh) {
        return res.status(400).json({ erro: "O campo cnh é obrigatório." });
    }

    // Valida se a string contém exatamente 11 dígitos numéricos
    const apenasNumeros = /^\d{11}$/;
    if (!apenasNumeros.test(String(cnh))) {
        return res.status(400).json({ erro: "A CNH deve conter exatamente 11 dígitos numéricos." });
    }

    next();
};

module.exports = validaCnh;

