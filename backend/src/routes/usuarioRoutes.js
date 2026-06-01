const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const auth = require("../middlewares/auth");

/* listar usuarios */
router.get("/usuarios", auth, usuarioController.listarUsuarios);

/* criar usuario */
router.post("/usuarios", usuarioController.criarUsuario);

router.get("/me", auth, usuarioController.me);

/* login */
router.post("/login", usuarioController.login);

/* atualizar usuario */
router.put(
  "/usuarios/:id",
  auth,
  usuarioController.atualizarUsuario
);

/* deletar usuario */
router.delete(
  "/usuarios/:id",
  auth,
  usuarioController.deletarUsuario
);

module.exports = router;