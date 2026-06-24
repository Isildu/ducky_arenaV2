const router = require("express").Router();

const {
    getPlayerProfiles,
    getPlayerProfileById,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
} = require("../controllers/player_profile.controller");

// Rutas específicas primero
router.get("/all", getPlayerProfiles);
router.get("/", getPlayerProfiles); // Alias de /all para CRUD READ basico

// Rutas base y dinámicas después
router.post("/", createPlayerProfile);
router.get("/:id", getPlayerProfileById);
router.put("/:id", updatePlayerProfile);
router.delete("/:id", deletePlayerProfile);

module.exports = router;
