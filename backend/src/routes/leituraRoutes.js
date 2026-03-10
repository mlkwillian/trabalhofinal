const express = require("express");
const router = express.Router();

const leituraController = require("../controllers/leituraController");

router.post("/leituras", leituraController.registrarLeitura);

module.exports = router;