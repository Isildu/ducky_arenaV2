const router = require("express").Router();

const {
    getPlayerCosmetics,
    getCosmeticsByProfile,
    getPlayerCosmeticById,
    unlockCosmetic,
    updateCosmeticStatus,
    removeCosmeticFromPlayer
} = require("../controllers/player_cosmetics.controller");

// Rutas específicas primero
router.get("/all", getPlayerCosmetics);
router.get("/", getPlayerCosmetics); // Alias de /all para CRUD READ basico
router.get("/profile/:profile_id", getCosmeticsByProfile); // Trae el inventario de un perfil
router.get("/:id", getPlayerCosmeticById);

// Rutas base y dinámicas por ID de la tabla intermedia
router.post("/", unlockCosmetic);
router.put("/:id", updateCosmeticStatus);
router.delete("/:id", removeCosmeticFromPlayer);

module.exports = router;
