const express = require("express");
const router = express.Router();

const salaController = require("../controllers/salaController");
const auth = require("../middleware/auth");

router.get("/salas", auth, salaController.listarSalas);

router.post("/salas", auth, salaController.criarSala);

module.exports = router;