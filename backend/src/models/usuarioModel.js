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
  },


  atualizar: (id, nome, email, tipo_usuario) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE usuarios SET nome=?, email=?, tipo_usuario=? WHERE id_usuario=?",
        [nome, email, tipo_usuario, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },
  
  deletar: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM usuarios WHERE id_usuario=?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

};



module.exports = Usuario;