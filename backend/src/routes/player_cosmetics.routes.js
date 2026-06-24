/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

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
router.get("/:id", getPlayerCosmeticById);

router.post("/", unlockCosmetic);
router.put("/:id", updateCosmeticStatus);
router.delete("/:id", removeCosmeticFromPlayer);

module.exports = router;
