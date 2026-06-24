/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

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
router.get("/:id", getFriendById);

router.post("/", addFriendRequest);
router.put("/:id", updateFriendStatus);
router.delete("/:id", removeFriendship);

module.exports = router;
