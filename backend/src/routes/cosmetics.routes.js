/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require("express");
const router = express.Router();
const validateId = require("../middleware/validate_id.middleware");

const {
    getCosmetics,
    getCosmeticById,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic
} = require("../controllers/cosmetics.controller");

router.get("/", getCosmetics);
router.get("/:id", validateId, getCosmeticById);
router.post("/", createCosmetic);
router.put("/:id", validateId, updateCosmetic);
router.delete("/:id", validateId, deleteCosmetic);

module.exports = router;
