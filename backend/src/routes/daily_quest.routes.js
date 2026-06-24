/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
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

router.get("/reward", getReward);
router.get("/all", getDailyQuests);
router.get("/description", getDescription);

router.get("/", getDailyQuests);

router.get("/:id", getDailyQuestsById);


router.post("/", createDailyQuest);

router.put("/:id", patchDailyQuest);
router.patch("/:id", patchDailyQuest);

router.delete("/:id", deleteDailyQuest);

module.exports = router;
