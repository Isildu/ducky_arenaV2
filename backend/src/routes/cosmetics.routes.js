/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require("express");
const router = express.Router();

const {
    getCosmetics,
    getCosmeticById,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic
} = require("../controllers/cosmetics.controller");

router.get("/", getCosmetics);
router.get("/:id", getCosmeticById);
router.post("/", createCosmetic);
router.put("/:id", updateCosmetic);
router.delete("/:id", deleteCosmetic);

module.exports = router;