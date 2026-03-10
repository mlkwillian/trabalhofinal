const db = require("../config/db");


/* listar todas as salas */

exports.listarSalas = (req, res) => {

  const query = "SELECT * FROM salas";

  db.query(query, (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar salas" });
    }

    res.json(result);

  });

};



/* criar nova sala */

exports.criarSala = (req, res) => {

  const { nome_sala, temperatura_min, temperatura_max } = req.body;

  if (!nome_sala || temperatura_min === undefined || temperatura_max === undefined) {
    return res.status(400).json({ erro: "Dados obrigatórios não informados" });
  }

  if (temperatura_min >= temperatura_max) {
    return res.status(400).json({
      erro: "Temperatura mínima deve ser menor que a máxima"
    });
  }

  const query = `
    INSERT INTO salas (nome_sala, temperatura_min, temperatura_max)
    VALUES (?, ?, ?)
  `;

  db.query(query, [nome_sala, temperatura_min, temperatura_max], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao criar sala" });
    }

    res.json({
      mensagem: "Sala criada com sucesso",
      id_sala: result.insertId
    });

  });

};