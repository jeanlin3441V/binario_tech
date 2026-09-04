const verificarContentType = (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({
      status: "ERRO_CABECALHO",
      mensagem: "Requisições POST exigem o cabeçalho Content-Type: application/json."
    });
  }
  next();
};

module.exports = verificarContentType;
