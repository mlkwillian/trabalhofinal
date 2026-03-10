const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "termoguard_secret";


/* listar usuarios */

exports.listarUsuarios = (req, res) => {

  Usuario.listar((err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }

    res.json(result);

  });

};



/* criar usuario */

exports.criarUsuario = async (req, res) => {

  const { nome, email, senha, tipo_usuario } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Campos obrigatórios não informados" });
  }

  try {

    const senhaHash = await bcrypt.hash(senha, 10);

    Usuario.criar(nome, email, senhaHash, tipo_usuario, (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao criar usuário" });
      }

      res.json({ mensagem: "Usuário criado com sucesso" });

    });

  } catch (err) {

    res.status(500).json({ erro: err });

  }

};



/* login */

exports.login = (req, res) => {

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  Usuario.buscarPorEmail(email, async (err, result) => {

    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }

    const usuario = result[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
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