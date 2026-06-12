const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "termoguard_secret";

/* =========================
   LISTAR USUÁRIOS
========================= */

exports.listarUsuarios = (req, res) => {

  Usuario.listar((err, result) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        erro: "Erro ao buscar usuários"
      });
    }

    res.json(result);

  });

};

exports.me = (req, res) => {

  Usuario.buscarPorId(req.usuario.id, (err, result) => {

    if (err) {
      return res.status(500).json({
        erro: "Erro ao buscar usuário"
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    const usuario = result[0];

    res.json({
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    });

  });

};


/* =========================
   CRIAR USUÁRIO
========================= */

exports.criarUsuario = async (req, res) => {

  const {
    nome,
    email,
    senha,
    tipo_usuario
  } = req.body;

  if (!nome || !email || !senha) {

    return res.status(400).json({
      erro: "Campos obrigatórios não informados"
    });

  }

  try {

    const senhaHash = await bcrypt.hash(senha, 10);

    Usuario.criar(
      nome,
      email,
      senhaHash,
      tipo_usuario,
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            erro: "Erro ao criar usuário"
          });

        }

        res.json({
          mensagem: "Usuário criado com sucesso"
        });

      }
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro interno"
    });

  }

};

exports.me = (req, res) => {

  Usuario.buscarPorId(req.usuario.id, (err, result) => {

    if (err) {
      return res.status(500).json({
        erro: "Erro ao buscar usuário"
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    const usuario = result[0];

    res.json({
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    });

  });

};

/* =========================
   LOGIN
========================= */

exports.login = (req, res) => {

  const { email, senha } = req.body;

  if (!email || !senha) {

    return res.status(400).json({
      erro: "Email e senha são obrigatórios"
    });

  }

  Usuario.buscarPorEmail(email, async (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro no servidor"
      });

    }

    if (result.length === 0) {

      return res.status(401).json({
        mensagem: "Credenciais inválidas"
      });

    }

    const usuario = result[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {

      return res.status(401).json({
        mensagem: "Credenciais inválidas"
      });

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
      token,

      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      }
    });

  });

};

/* =========================
   ATUALIZAR USUÁRIO
========================= */

exports.atualizarUsuario = async (req, res) => {

  const { id } = req.params;

  const {
    nome,
    email,
    senha,
    tipo_usuario
  } = req.body;

  try {

    let senhaHash = null;

    if (senha) {
      senhaHash = await bcrypt.hash(senha, 10);
    }

    await Usuario.atualizar(
      id,
      nome,
      email,
      senhaHash,
      tipo_usuario
    );

    res.json({
      mensagem: "Usuário atualizado com sucesso"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao atualizar usuário"
    });

  }

};

/* =========================
   DELETAR USUÁRIO
========================= */

exports.deletarUsuario = async (req, res) => {

  const { id } = req.params;

  try {

    await Usuario.deletar(id);

    res.json({
      mensagem: "Usuário deletado com sucesso"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao deletar usuário"
    });

  }

};