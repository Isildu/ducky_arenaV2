const router = require("express").Router();

const {
    getGlobalFriends,
    getFriendsByProfile,
    addFriendRequest,
    updateFriendStatus,
    removeFriendship
} = require("../controllers/friends.controller");

// Rutas específicas primero
router.get("/all", getGlobalFriends);
router.get("/profile/:profile_id", getFriendsByProfile); // Ver amigos de un jugador

// Rutas de cambio de estado y eliminación
router.post("/", addFriendRequest);
router.put("/:id", updateFriendStatus);
router.delete("/:id", removeFriendship);

module.exports = router;