const db = require("../config/db");

const Leitura = {

  criarLeitura: (sensor_id, temperatura, umidade, callback) => {

    const query = `
      INSERT INTO leituras (id_sensor, temperatura, umidade)
      VALUES (?, ?, ?)
    `;

    db.query(query, [sensor_id, temperatura, umidade], callback);
  },


  buscarLimitesSala: (sensor_id, callback) => {

    const query = `
      SELECT s.id_sala, s.temperatura_min, s.temperatura_max
      FROM sensores se
      JOIN salas s ON se.id_sala = s.id_sala
      WHERE se.id_sensor = ?
    `;

    db.query(query, [sensor_id], callback);
  },


  ultimas24h: (sensor_id, callback) => {

    const query = `
      SELECT temperatura, umidade, data_hora
      FROM leituras
      WHERE id_sensor = ?
      AND data_hora >= NOW() - INTERVAL 24 HOUR
      ORDER BY data_hora
    `;

    db.query(query, [sensor_id], callback);
  }

};

module.exports = Leitura;