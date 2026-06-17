const router = require("express").Router();

const {
    getPlayerCosmetics,
    getCosmeticsByProfile,
    unlockCosmetic,
    updateCosmeticStatus,
    removeCosmeticFromPlayer
} = require("../controllers/cosmetics.controller");

// Rutas específicas primero
router.get("/all", getPlayerCosmetics);
router.get("/profile/:profile_id", getCosmeticsByProfile); // Trae el inventario de un perfil

// Rutas base y dinámicas por ID de la tabla intermedia
router.post("/", unlockCosmetic);
router.put("/:id", updateCosmeticStatus);
router.delete("/:id", removeCosmeticFromPlayer);

module.exports = router;