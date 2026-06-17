const router = require("express").Router();

const {
    getDailyQuests,
    getDailyQuestsById,
    getReward,
    getDescription,
    createDailyQuest,
    //updateDailyQuest,
    patchDailyQuest,
    deleteDailyQuest
} = require("../controllers/Daily_quest.CRUD.js");

router.get("/reward/:reward", getReward);   // Filtrar por recompensa
router.get("/all", getDailyQuests);               // Todos los quests completos
router.get("/", getDailyQuests);                  // Todos los quests (id y nombre)
router.get("/:id", getDailyQuestsById);           // Quest específico por ID
router.get("/description/:description", getDescription); // Filtrar por descripción

router.post("/", createDailyQuest);

//router.put("/:id", updateDailyQuest);    // Actualización completa
router.patch("/:id", patchDailyQuest);   // Actualización parcial

router.delete("/:id", deleteDailyQuest);

module.exports = router;