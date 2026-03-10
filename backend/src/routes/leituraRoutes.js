const express = require("express");
const router = express.Router();

const leituraController = require("../controllers/leituraController");

/* registrar leitura do sensor */
router.post("/leituras", leituraController.registrarLeitura);

/* listar leituras */
router.get("/leituras", leituraController.listarLeituras);

module.exports = router;