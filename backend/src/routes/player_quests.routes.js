/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

const {
    getPlayerQuests,
    getQuestsByProfile,
    getPlayerQuestById,
    assignQuest,
    updateQuestStatus,
    removeQuestFromPlayer
} = require("../controllers/player_quests.controller");

router.get("/all", getPlayerQuests);
router.get("/", getPlayerQuests);
router.get("/profile/:profile_id", getQuestsByProfile);
router.get("/:id", getPlayerQuestById);

router.post("/", assignQuest);
router.put("/:id", updateQuestStatus);
router.delete("/:id", removeQuestFromPlayer);

module.exports = router;
