const jwt = require("jsonwebtoken");

const SECRET = "termoguard_secret";

function verificarToken(req, res, next) {

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {

    if (err) {
      return res.status(403).json({ mensagem: "Token inválido" });
    }

    req.usuario = decoded;

    next();

  });

}

module.exports = verificarToken;