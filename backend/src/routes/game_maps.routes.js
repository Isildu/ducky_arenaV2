/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
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

router.get("/environment", getGameMapsByEnvironmentType);
router.get("/names", getGameMapNames);
router.get("/", getGameMaps);
router.get("/:id", getGameMapById);

router.post("/", createGameMap);

router.put("/:id", patchGameMap);
router.patch("/:id", patchGameMap);

router.delete("/:id", deleteGameMap);

module.exports = router;
