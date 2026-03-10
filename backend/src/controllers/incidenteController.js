const db = require("../config/db");

exports.listarIncidentes = (req, res) => {

  const query = `
  SELECT i.*, s.nome_sala
  FROM incidentes i
  JOIN salas s ON i.id_sala = s.id_sala
  WHERE i.status = 'aberto'
  `;

  db.query(query, (err, result) => {

    if (err) return res.status(500).send(err);

    res.json(result);

  });

};


exports.resolverIncidente = (req, res) => {

  const { id_incidente, observacao, usuario_id } = req.body;

  const query = `
  UPDATE incidentes
  SET
  status = 'resolvido',
  data_resolucao = NOW(),
  observacao = ?,
  id_usuario = ?
  WHERE id_incidente = ?
  `;

  db.query(query, [observacao, usuario_id, id_incidente], (err) => {

    if (err) return res.status(500).send(err);

    res.json({ mensagem: "Incidente resolvido" });

  });

};