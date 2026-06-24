const router = require("express").Router();

const {
    getGameMaps,
    getGameMapById,
    getGameMapsByEnvironmentType,
    getGameMapNames,
    createGameMap,
    patchGameMap,
    deleteGameMap
} = require("../controllers/game_maps.controller.js");

router.get("/environment", getGameMapsByEnvironmentType);// Filtrar por tipo de entorno
router.get("/names", getGameMapNames); // Obtener solo los nombres de los mapas
router.get("/", getGameMaps); // Todos los mapas
router.get("/:id", getGameMapById); // Mapa específico por ID

router.post("/", createGameMap);

// PUT reutiliza la actualizacion parcial existente para mantener compatibilidad.
router.put("/:id", patchGameMap);
router.patch("/:id", patchGameMap);   // Actualización parcial

router.delete("/:id", deleteGameMap);

module.exports = router;
