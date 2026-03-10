const express = require("express");
const cors = require("cors");

const leituraRoutes = require("./routes/leituraRoutes");
const salaRoutes = require("./routes/salaRoutes");
const incidenteRoutes = require("./routes/incidenteRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* rota de teste */

app.get("/", (req, res) => {
  res.send("API TermoGuard funcionando");
});

/* rotas da API */

app.use("/api", usuarioRoutes);
app.use("/api", leituraRoutes);
app.use("/api", salaRoutes);
app.use("/api", incidenteRoutes);

/* iniciar servidor */

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});