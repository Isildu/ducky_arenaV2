const router = require("express").Router();

const {
    getDailyQuests,
    getDailyQuestsById,
    getReward,
    getDescription,
    createDailyQuest,
    patchDailyQuest,
    deleteDailyQuest
} = require("../controllers/daily_quest.controller");

router.get("/reward", getReward);   // Filtrar por recompensa
router.get("/all", getDailyQuests);               // Todos los quests completos
router.get("/description", getDescription); // Filtrar por descripción

router.get("/", getDailyQuests);                  // Todos los quests (id y nombre)

router.get("/:id", getDailyQuestsById);           // Quest específico por ID


router.post("/", createDailyQuest);

// PUT reutiliza la actualizacion parcial existente para mantener compatibilidad.
router.put("/:id", patchDailyQuest);
router.patch("/:id", patchDailyQuest);   // Actualización parcial

router.delete("/:id", deleteDailyQuest);

module.exports = router;
