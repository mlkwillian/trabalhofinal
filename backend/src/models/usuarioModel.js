const db = require("../config/db");

const Usuario = {

  /* =========================
     LISTAR
  ========================= */

  listar: (callback) => {

    const query = `
      SELECT
        id_usuario,
        nome,
        email,
        tipo_usuario
      FROM usuarios
    `;

    db.query(query, callback);

  },

  /* =========================
     CRIAR
  ========================= */

  criar: (
    nome,
    email,
    senha,
    tipo_usuario,
    callback
  ) => {

    const query = `
      INSERT INTO usuarios
      (
        nome,
        email,
        senha,
        tipo_usuario
      )
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        nome,
        email,
        senha,
        tipo_usuario
      ],
      callback
    );

  },

  /* =========================
     BUSCAR POR EMAIL
  ========================= */

  buscarPorEmail: (
    email,
    callback
  ) => {

    const query = `
      SELECT *
      FROM usuarios
      WHERE email = ?
    `;

    db.query(
      query,
      [email],
      callback
    );

  },

  /* =========================
     ATUALIZAR
  ========================= */

  atualizar: (
    id,
    nome,
    email,
    tipo_usuario
  ) => {

    return new Promise((resolve, reject) => {

      const query = `
        UPDATE usuarios
        SET
          nome = ?,
          email = ?,
          tipo_usuario = ?
        WHERE id_usuario = ?
      `;

      db.query(
        query,
        [
          nome,
          email,
          tipo_usuario,
          id
        ],
        (err, result) => {

          if (err) {
            reject(err);
          } else {
            resolve(result);
          }

        }
      );

    });

  },

  /* =========================
     DELETAR
  ========================= */

  deletar: (id) => {

    return new Promise((resolve, reject) => {

      const query = `
        DELETE FROM usuarios
        WHERE id_usuario = ?
      `;

      db.query(
        query,
        [id],
        (err, result) => {

          if (err) {
            reject(err);
          } else {
            resolve(result);
          }

        }
      );

    });

  }

};

module.exports = Usuario;