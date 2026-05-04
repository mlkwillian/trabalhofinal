const Leitura = require("../models/leituraModel");
const Incidente = require("../models/incidenteModel");
const db = require("../config/db");

exports.registrarLeitura = (req, res) => {

  const { id_sensor } = req.body;

  const temperatura = Number(req.body.temperatura);
  const umidade = Number(req.body.umidade);

  if (!id_sensor || temperatura === undefined || umidade === undefined) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  console.log(`Sensor ${id_sensor} → Temp: ${temperatura}°C`);
  
  Leitura.criarLeitura(id_sensor, temperatura, umidade, (err) => {

    if (err) return res.status(500).send(err);

    Leitura.buscarLimitesSala(id_sensor, (err, result) => {

      if (err) return res.status(500).send(err);

      if (result.length === 0) {
        return res.status(404).json({ erro: "Sensor não encontrado" });
      }

      const sala = result[0];

      const foraDoPadrao =
        temperatura < sala.temperatura_min ||
        temperatura > sala.temperatura_max;

      if (foraDoPadrao) {

        Incidente.existeAberto(sala.id_sala, (err, incidente) => {

          if (err) return res.status(500).send(err);

          if (incidente.length === 0) {
            Incidente.criar(sala.id_sala, () => {
              console.log("🚨 Incidente criado!");
            });
          }

        });

      } else {

        Incidente.fecharAutomatico(sala.id_sala, () => {
          console.log("✅ Incidente fechado automaticamente");
        });

      }

      res.json({ mensagem: "Leitura registrada com sucesso" });

    });

  });

};



exports.listarLeituras = (req, res) => {

  const { sala_id } = req.query;

  if (!sala_id) {
    return res.status(400).json({ erro: "sala_id obrigatório" });
  }

  const query = `
    SELECT 
      l.id_leitura,
      l.data_leitura,
      l.temperatura,
      l.umidade,
      s.id_sala
    FROM leituras l
    JOIN sensores se ON l.id_sensor = se.id_sensor
    JOIN salas s ON se.id_sala = s.id_sala
    WHERE s.id_sala = ?
    ORDER BY l.data_leitura ASC
  `;

  db.query(query, [sala_id], (err, result) => {

    if (err) {
      console.error("Erro SQL:", err);
      return res.status(500).json({ erro: "Erro ao buscar leituras" });
    }

    res.json(result);

  });

};



exports.ultimasLeituras = (req, res) => {

  const query = `
    SELECT 
      sa.nome_sala AS sala,
      l.temperatura,
      l.umidade,
      sa.temperatura_min,
      sa.temperatura_max,
      l.data_leitura
    FROM leituras l
    JOIN sensores se ON l.id_sensor = se.id_sensor
    JOIN salas sa ON se.id_sala = sa.id_sala
    ORDER BY l.data_leitura DESC
    LIMIT 10
  `;

  db.query(query, (err, result) => {

    if (err) {
      console.error("ERRO SQL:", err);
      return res.status(500).json({ erro: "Erro ao buscar leituras 😢" });
    }

    res.json(result);

  });

};



exports.alertasAtivos = (req, res) => {

  const query = `
    SELECT 
      i.id_incidente,
      sa.nome_sala AS sala,
      i.data_inicio
    FROM incidentes i
    JOIN salas sa ON i.id_sala = sa.id_sala
    WHERE i.status = 'aberto'
  `;

  db.query(query, (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar alertas 😢" });
    }

    res.json(result);

  });

};
