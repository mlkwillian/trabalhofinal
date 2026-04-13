const Leitura = require("../models/leituraModel");
const Incidente = require("../models/incidenteModel");

exports.registrarLeitura = (req, res) => {

  const { sensor_id } = req.body;

  const temperatura = Number(req.body.temperatura);
  const umidade = Number(req.body.umidade);

  if (!sensor_id || temperatura === undefined || umidade === undefined) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  console.log(`Sensor ${sensor_id} → Temp: ${temperatura}°C`);
  
  Leitura.criarLeitura(sensor_id, temperatura, umidade, (err) => {

    if (err) return res.status(500).send(err);

    Leitura.buscarLimitesSala(sensor_id, (err, result) => {

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
  const query = `
    SELECT 
      l.data_hora as dt,
      s.nome_sala as env,
      l.temperatura as temp,
      s.temperatura_min as min,
      s.temperatura_max as max
    FROM leituras l
    JOIN sensores se ON l.id_sensor = se.id_sensor
    JOIN salas s ON se.id_sala = s.id_sala
    ORDER BY l.data_hora DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar leituras" });
    }

    res.json(result);
  });
};