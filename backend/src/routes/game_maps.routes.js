/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

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
router.get("/:id", validateId, getGameMapById);

router.post("/", createGameMap);

router.put("/:id", validateId, patchGameMap);
router.patch("/:id", validateId, patchGameMap);

router.delete("/:id", validateId, deleteGameMap);

module.exports = router;
