const express = require("express");
const cors = require("cors");

const leituraRoutes = require("./routes/leituraRoutes");
const salaRoutes = require("./routes/salaRoutes");
const incidenteRoutes = require("./routes/incidenteRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api", usuarioRoutes);
app.use("/api", leituraRoutes);
app.use("/api", salaRoutes);
app.use("/api", incidenteRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});