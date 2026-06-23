const router = require("express").Router();

const {
    getPlayerProfiles,
    getPlayerProfileById,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
} = require("../controllers/players.controller");

// Rutas específicas primero
router.get("/all", getPlayerProfiles);

// Rutas base y dinámicas después
router.post("/", createPlayerProfile);
router.get("/:id", getPlayerProfileById);
router.put("/:id", updatePlayerProfile);
router.delete("/:id", deletePlayerProfile);

module.exports = router;