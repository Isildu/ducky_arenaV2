const router = require("express").Router();

const {
    getMatches,
    getMatchById,
    getMatchesByGameMode,
    getMatchesByMapId,
    getMatchBasicInfo,
    createMatch,
    patchMatch,
    deleteMatch
} = require("../controllers/matches.controller.js");

router.get("/environment/:environment_type", getMatchesByEnvironmentType); // Filtrar por tipo de entorno
router.get("/names", getMatchNames); // Obtener solo los nombres de los partidos
router.get("/", getMatches); // Todos los partidos
router.get("/:id", getMatchById); // Partido específico por ID

router.post("/", createMatch);

//router.put("/:id", updateMatch);    // Actualización completa
router.patch("/:id", patchMatch);   // Actualización parcial

router.delete("/:id", deleteMatch);

module.exports = router;