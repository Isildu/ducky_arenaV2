/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

const {
    getPlayerCosmetics,
    getCosmeticsByProfile,
    getPlayerCosmeticById,
    unlockCosmetic,
    updateCosmeticStatus,
    removeCosmeticFromPlayer
} = require("../controllers/player_cosmetics.controller");

router.get("/all", getPlayerCosmetics);
router.get("/", getPlayerCosmetics);
router.get("/profile/:profile_id", getCosmeticsByProfile);
router.get("/:id", validateId, getPlayerCosmeticById);

router.post("/", unlockCosmetic);
router.put("/:id", validateId, updateCosmeticStatus);
router.delete("/:id", validateId, removeCosmeticFromPlayer);

module.exports = router;
