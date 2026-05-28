const mqtt = require("mqtt");
const mysql = require("mysql2");

// ===== MQTT =====
const client = mqtt.connect("mqtt://10.84.6.133");

// ===== MYSQL =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "termoguard"
});

// ===== CONEXÃO =====
db.connect((err) => {
  if (err) {
    console.log("Erro MySQL:", err);
    return;
  }

  console.log("MySQL conectado");
});

// ===== MQTT =====
client.on("connect", () => {

  console.log("MQTT conectado");

  client.subscribe("termoguard/dados");
});

// ===== RECEBENDO DADOS =====
client.on("message", (topic, message) => {

  try {

    const dados = JSON.parse(message.toString());

    console.log("Dados recebidos:", dados);

    const sql = `
      INSERT INTO leituras
      (temperatura, umidade, led)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [
        dados.temperatura,
        dados.umidade,
        dados.led
      ],
      (err, result) => {

        if (err) {
          console.log("Erro insert:", err);
          return;
        }

        console.log("Dados salvos!");
      }
    );

  } catch (erro) {

    console.log("Erro JSON:", erro);
  }
});