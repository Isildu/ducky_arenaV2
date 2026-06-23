const router = require("express").Router();

const {
    getPlayerQuests,
    getQuestsByProfile,
    assignQuest,
    updateQuestStatus,
    removeQuestFromPlayer
} = require("../controllers/playerquests.controller");

// Rutas específicas primero
router.get("/all", getPlayerQuests);
router.get("/profile/:profile_id", getQuestsByProfile); // Panel de misiones de un jugador

// Rutas dinámicas por ID de la tabla intermedia
router.post("/", assignQuest);
router.put("/:id", updateQuestStatus);
router.delete("/:id", removeQuestFromPlayer);

module.exports = router;