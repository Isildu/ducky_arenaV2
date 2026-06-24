/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

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

router.get("/:id", validateId, getDailyQuestsById);


router.post("/", createDailyQuest);

router.put("/:id", validateId, patchDailyQuest);
router.patch("/:id", validateId, patchDailyQuest);

router.delete("/:id", validateId, deleteDailyQuest);

module.exports = router;
