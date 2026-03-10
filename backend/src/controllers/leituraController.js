const Leitura = require("../models/leituraModel");
const Incidente = require("../models/incidenteModel");

exports.registrarLeitura = (req, res) => {

  const { sensor_id, temperatura, umidade } = req.body;

  Leitura.criarLeitura(sensor_id, temperatura, umidade, (err) => {

    if (err) return res.status(500).send(err);

    /* buscar limites da sala */

    Leitura.buscarLimitesSala(sensor_id, (err, result) => {

      if (err) return res.status(500).send(err);

      const sala = result[0];

      const foraDoPadrao =
        temperatura < sala.temperatura_min ||
        temperatura > sala.temperatura_max;

      if (foraDoPadrao) {

        /* verificar se já existe incidente aberto */

        Incidente.existeAberto(sala.id_sala, (err, incidente) => {

          if (err) return res.status(500).send(err);

          if (incidente.length === 0) {

            /* cria incidente apenas se não existir */

            Incidente.criar(sala.id_sala, () => {
              console.log("🚨 Incidente criado!");
            });

          }

        });

      } else {

        /* se voltou ao normal, fechar incidente */

        Incidente.fecharAutomatico(sala.id_sala, () => {
          console.log("✅ Incidente fechado automaticamente");
        });

      }

      res.json({ mensagem: "Leitura registrada" });

    });

  });

};