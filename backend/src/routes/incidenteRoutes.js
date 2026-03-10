const express = require("express");
const router = express.Router();

const incidenteController = require("../controllers/incidenteController");

router.get("/incidentes", incidenteController.listarIncidentes);
router.put("/incidentes", incidenteController.resolverIncidente);

module.exports = router;