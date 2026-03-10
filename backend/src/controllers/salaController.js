const db = require("../config/db");

exports.listarSalas = (req, res) => {

  db.query("SELECT * FROM salas", (err, result) => {

    if (err) return res.status(500).send(err);

    res.json(result);

  });

};


exports.criarSala = (req, res) => {

  const { nome_sala, temperatura_min, temperatura_max } = req.body;

  const query = `
    INSERT INTO salas (nome_sala, temperatura_min, temperatura_max)
    VALUES (?, ?, ?)
  `;

  db.query(query, [nome_sala, temperatura_min, temperatura_max], (err) => {

    if (err) return res.status(500).send(err);

    res.json({ mensagem: "Sala criada" });

  });

};