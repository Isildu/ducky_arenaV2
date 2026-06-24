/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require("express");
const router = express.Router();
const validateId = require("../middleware/validate_id.middleware");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/auth_user.controller");

router.get("/", getUsers);
router.get("/:id", validateId, getUserById);
router.post("/", createUser);
router.put("/:id", validateId, updateUser);
router.delete("/:id", validateId, deleteUser);

module.exports = router;
