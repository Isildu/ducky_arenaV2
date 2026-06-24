/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

const {
    getGlobalFriends,
    getFriendsByProfile,
    getFriendById,
    addFriendRequest,
    updateFriendStatus,
    removeFriendship
} = require("../controllers/player_friends.controller");

router.get("/all", getGlobalFriends);
router.get("/", getGlobalFriends);
router.get("/profile/:profile_id", getFriendsByProfile);
router.get("/:id", validateId, getFriendById);

router.post("/", addFriendRequest);
router.put("/:id", validateId, updateFriendStatus);
router.delete("/:id", validateId, removeFriendship);

module.exports = router;
