const db = require("../config/db");

const Sala = {

  listar: (callback) => {

    const query = "SELECT * FROM salas";

    db.query(query, callback);
  },


  criar: (nome_sala, temperatura_min, temperatura_max, callback) => {

    const query = `
      INSERT INTO salas (nome_sala, temperatura_min, temperatura_max)
      VALUES (?, ?, ?)
    `;

    db.query(query, [nome_sala, temperatura_min, temperatura_max], callback);
  }

};

module.exports = Sala;