const express = require("express");
const router = express.Router();

const salaController = require("../controllers/salaController");
const auth = require("../middleware/auth");

router.get("/salas", auth, salaController.listarSalas);

router.post("/salas", auth, salaController.criarSala);

router.put("/salas/:id", auth, salaController.atualizarSala);

router.delete("/salas/:id", auth, salaController.deletarSala);

module.exports = router;