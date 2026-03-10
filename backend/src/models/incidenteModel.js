const db = require("../config/db");

const Incidente = {

  /* verifica se já existe incidente aberto */

  existeAberto: (id_sala, callback) => {

    const query = `
      SELECT * FROM incidentes
      WHERE id_sala = ?
      AND status = 'aberto'
      LIMIT 1
    `;

    db.query(query, [id_sala], callback);
  },


  /* criar incidente */

  criar: (id_sala, callback) => {

    const query = `
      INSERT INTO incidentes (id_sala, data_inicio, status)
      VALUES (?, NOW(), 'aberto')
    `;

    db.query(query, [id_sala], callback);
  },


  /* fechar incidente automaticamente */

  fecharAutomatico: (id_sala, callback) => {

    const query = `
      UPDATE incidentes
      SET
      status = 'resolvido',
      data_resolucao = NOW(),
      observacao = 'Temperatura voltou ao normal'
      WHERE id_sala = ?
      AND status = 'aberto'
    `;

    db.query(query, [id_sala], callback);
  }

};

module.exports = Incidente;