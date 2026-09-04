const autorizarPerfil = (...perfisPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        status: "ERRO",
        mensagem: "Acesso negado. Seu perfil não possui permissão para acessar este recurso."
      });
    }
    next();
  };
};

module.exports = autorizarPerfil;
