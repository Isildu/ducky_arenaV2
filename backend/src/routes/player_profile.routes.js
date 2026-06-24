/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

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
router.get("/:id/dashboard", validateId, getPlayerDashboard);
router.get("/:id/stats", validateId, getPlayerStats);
router.get("/:id/inventory", validateId, getPlayerInventory);

router.post("/", createPlayerProfile);
router.get("/:id", validateId, getPlayerProfileById);
router.put("/:id", validateId, updatePlayerProfile);
router.delete("/:id", validateId, deletePlayerProfile);

module.exports = router;
