const router = require("express").Router();

const {
    getGameMaps,
    getGameMapById,
    getGameMapsByEnvironmentType,
    getGameMapNames,
    createGameMap,
    //updateGameMap,
    patchGameMap,
    deleteGameMap
} = require("../controllers/game_maps.controller.js");

router.get("/environment/:environment_type", getGameMapsByEnvironmentType); // Filtrar por tipo de entorno
router.get("/names", getGameMapNames); // Obtener solo los nombres de los mapas
router.get("/", getGameMaps); // Todos los mapas
router.get("/:id", getGameMapById); // Mapa específico por ID

router.post("/", createGameMap);

//router.put("/:id", updateGameMap);    // Actualización completa
router.patch("/:id", patchGameMap);   // Actualización parcial

router.delete("/:id", deleteGameMap);

module.exports = router;