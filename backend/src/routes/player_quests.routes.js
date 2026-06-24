/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

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
router.get("/:id", validateId, getPlayerQuestById);

router.post("/", assignQuest);
router.put("/:id", validateId, updateQuestStatus);
router.delete("/:id", validateId, removeQuestFromPlayer);

module.exports = router;
