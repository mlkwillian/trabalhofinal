const db = require("../config/db");

const Usuario = {

  listar: (callback) => {

    const query = "SELECT id_usuario, nome, email, tipo_usuario FROM usuarios";

    db.query(query, callback);
  },


  criar: (nome, email, senha, tipo_usuario, callback) => {

    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo_usuario)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [nome, email, senha, tipo_usuario], callback);
  },


  buscarPorEmail: (email, callback) => {

    const query = `
      SELECT * FROM usuarios
      WHERE email = ?
    `;

    db.query(query, [email], callback);
  }

};

module.exports = Usuario;