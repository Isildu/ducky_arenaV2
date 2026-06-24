const router = require("express").Router();

const {
    getGlobalFriends,
    getFriendsByProfile,
    getFriendById,
    addFriendRequest,
    updateFriendStatus,
    removeFriendship
} = require("../controllers/player_friends.controller");

// Rutas específicas primero
router.get("/all", getGlobalFriends);
router.get("/", getGlobalFriends); // Alias de /all para CRUD READ basico
router.get("/profile/:profile_id", getFriendsByProfile); // Ver amigos de un jugador
router.get("/:id", getFriendById);

// Rutas de cambio de estado y eliminación
router.post("/", addFriendRequest);
router.put("/:id", updateFriendStatus);
router.delete("/:id", removeFriendship);

module.exports = router;
