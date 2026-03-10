const express = require("express");
const router = express.Router();

const incidenteController = require("../controllers/incidenteController");


/* listar incidentes abertos */

router.get("/incidentes", incidenteController.listarIncidentes);


/* resolver incidente */

router.put("/incidentes/:id", incidenteController.resolverIncidente);


module.exports = router;