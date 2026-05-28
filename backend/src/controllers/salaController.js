const db = require("../config/db");

/* listar todas as salas */
exports.listarSalas = (req, res) => {

  const query = `
  SELECT 
    s.id_sala,
    s.nome_sala,
    s.temperatura_min,
    s.temperatura_max,

    se.id_sensor,

    l.temperatura,
    l.umidade,
    l.data_leitura

  FROM salas s

  LEFT JOIN sensores se
    ON se.id_sala = s.id_sala

  LEFT JOIN leituras l
    ON l.id_leitura = (

      SELECT l2.id_leitura
      FROM leituras l2
      WHERE l2.id_sensor = se.id_sensor
      ORDER BY l2.data_leitura DESC
      LIMIT 1
    )

  ORDER BY s.id_sala ASC
`;

  db.query(query, (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao buscar salas"
      });
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

/* atualizar sala */
exports.atualizarSala = (req, res) => {
  const { id } = req.params;
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
    UPDATE salas
    SET nome_sala = ?, temperatura_min = ?, temperatura_max = ?
    WHERE id_sala = ?
  `;

  db.query(query, [nome_sala, temperatura_min, temperatura_max, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao atualizar sala" });
    }

    res.json({ mensagem: "Sala atualizada com sucesso" });
  });
};

/* deletar sala */
exports.deletarSala = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM salas WHERE id_sala = ?";

  db.query(query, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao deletar sala" });
    }

    res.json({ mensagem: "Sala deletada com sucesso" });
  });
};