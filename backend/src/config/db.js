const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "termoguard"
});

db.connect((err) => {
  if (err) {
    console.log("Erro no banco:", err);
  } else {
    console.log("Banco conectado!");
  }
});

module.exports = db;