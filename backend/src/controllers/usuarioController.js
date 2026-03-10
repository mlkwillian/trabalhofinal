const Usuario = require("../models/usuarioModel");
const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "termoguard_secret";

exports.listarUsuarios = (req, res) => {

  Usuario.listar((err, result) => {

    if (err) return res.status(500).send(err);

    res.json(result);

  });

};


exports.criarUsuario = async (req, res) => {

  const { nome, email, senha, tipo_usuario } = req.body;

  try {

    const senhaHash = await bcrypt.hash(senha, 10);

    Usuario.criar(nome, email, senhaHash, tipo_usuario, (err) => {

      if (err) return res.status(500).send(err);

      res.json({ mensagem: "Usuário criado com sucesso" });

    });

  } catch (err) {

    res.status(500).json({ erro: err });

  }

};


exports.login = (req, res) => {

  const { email, senha } = req.body;

  Usuario.buscarPorEmail(email, async (err, result) => {

    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const usuario = result[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        tipo: usuario.tipo_usuario
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensagem: "Login realizado",
      token: token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        tipo: usuario.tipo_usuario
      }
    });

  });

};