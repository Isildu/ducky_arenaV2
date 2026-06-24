/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

const {
    getPlayerProfiles,
    getPlayerProfileById,
    getPlayerDashboard,
    getPlayerStats,
    getPlayerInventory,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
} = require("../controllers/player_profile.controller");

router.get("/all", getPlayerProfiles);
router.get("/", getPlayerProfiles);
router.get("/:id/dashboard", getPlayerDashboard);
router.get("/:id/stats", getPlayerStats);
router.get("/:id/inventory", getPlayerInventory);

router.post("/", createPlayerProfile);
router.get("/:id", getPlayerProfileById);
router.put("/:id", updatePlayerProfile);
router.delete("/:id", deletePlayerProfile);

module.exports = router;
