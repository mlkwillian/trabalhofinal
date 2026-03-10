const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const auth = require("../middleware/auth");

/* listar usuarios */
router.get("/usuarios", auth, usuarioController.listarUsuarios);

/* criar usuario */
router.post("/usuarios", usuarioController.criarUsuario);

/* login */
router.post("/login", usuarioController.login);

module.exports = router;