const express = require("express");
const router = express.Router();

const leituraController = require("../controllers/leituraController");

/* registrar leitura do sensor */
router.post("/leituras", leituraController.registrarLeitura);

/* listar leituras */
router.get("/leituras", leituraController.listarLeituras);




router.get("/leituras/ultimas", leituraController.ultimasLeituras);
router.get("/alertas", leituraController.alertasAtivos);


module.exports = router;