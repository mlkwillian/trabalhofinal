require("dotenv").config();

const mqtt = require("mqtt");
const mysql = require("mysql2");

// =====================================
// CONFIGURAÇÃO
// =====================================

const MODO_DEMO = process.env.MODO_DEMO === "true";

// =====================================
// MQTT
// =====================================

const client = mqtt.connect("mqtt://10.84.6.133");

// =====================================
// MYSQL
// =====================================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "termoguard",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Erro MySQL:", err);
    return;
  }

  console.log("✅ MySQL conectado");
});


// =====================================
// FUNÇÃO SALVAR LEITURA
// =====================================

function salvarLeitura(dados) {

  const sql = `
    INSERT INTO leituras
    (id_sensor, temperatura, umidade)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      dados.id_sensor,
      dados.temperatura,
      dados.umidade
    ],
    (err) => {

      if (err) {
        console.log("❌ Erro insert:", err);
        return;
      }

      console.log(
        `✅ Sensor ${dados.id_sensor} -> ${dados.temperatura}°C`
      );

    }
  );
}

// =====================================
// DEMO
// =====================================

let indice = 0;

const sensoresDemo = [
  {
    id_sensor: 1,
    temperaturas: [
      20,21,22,23,24,
      35,
      22,21,
      10,
      23
    ]
  },
  {
    id_sensor: 2,
    temperaturas: [
      19,20,21,
      30,
      22,23,
      12,
      21
    ]
  }
];

function gerarDadosDemo() {

  const sensor = sensoresDemo[
    Math.floor(Math.random() * sensoresDemo.length)
  ];

  const temperatura =
    sensor.temperaturas[
      Math.floor(
        Math.random() * sensor.temperaturas.length
      )
    ];

  return {
    id_sensor: sensor.id_sensor,
    temperatura,
    umidade:
      Math.floor(Math.random() * 20) + 60
  };
}

// =====================================
// MODO DEMO
// =====================================

if (MODO_DEMO) {

  console.log("🚀 MODO DEMO ATIVADO");

  setInterval(() => {

    const dados = gerarDadosDemo();

    console.log("📊 Dados Demo:", dados);

    salvarLeitura(dados);

  }, 3000);

}

// =====================================
// MODO IOT REAL
// =====================================

else {

  console.log("📡 MODO IOT ATIVADO");

  client.on("connect", () => {

    console.log("✅ MQTT conectado");

    client.subscribe("termoguard/dados");

  });

  client.on("message", (topic, message) => {

    try {

      const dados = JSON.parse(
        message.toString()
      );

      console.log(
        "📥 Dados recebidos:",
        dados
      );

      salvarLeitura(dados);

    } catch (erro) {

      console.log(
        "❌ Erro JSON:",
        erro
      );

    }

  });

  client.on("error", (err) => {

    console.log(
      "❌ Erro MQTT:",
      err
    );

  });

}