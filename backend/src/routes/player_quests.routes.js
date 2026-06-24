const router = require("express").Router();

const {
    getPlayerQuests,
    getQuestsByProfile,
    getPlayerQuestById,
    assignQuest,
    updateQuestStatus,
    removeQuestFromPlayer
} = require("../controllers/player_quests.controller");

// Rutas específicas primero
router.get("/all", getPlayerQuests);
router.get("/", getPlayerQuests); // Alias de /all para CRUD READ basico
router.get("/profile/:profile_id", getQuestsByProfile); // Panel de misiones de un jugador
router.get("/:id", getPlayerQuestById);

// Rutas dinámicas por ID de la tabla intermedia
router.post("/", assignQuest);
router.put("/:id", updateQuestStatus);
router.delete("/:id", removeQuestFromPlayer);

module.exports = router;
