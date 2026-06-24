/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

const {
    getPlayerProfiles,
    getPlayerProfileById,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
} = require("../controllers/player_profile.controller");

router.get("/all", getPlayerProfiles);
router.get("/", getPlayerProfiles);

router.post("/", createPlayerProfile);
router.get("/:id", getPlayerProfileById);
router.put("/:id", updatePlayerProfile);
router.delete("/:id", deletePlayerProfile);

module.exports = router;
