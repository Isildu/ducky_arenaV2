/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require("express");
const router = express.Router();

const {
    getAbilities,
    getAbilityById,
    createAbility,
    updateAbility,
    deleteAbility
} = require("../controllers/abilities.controller");

router.get("/", getAbilities);
router.get("/:id", getAbilityById);
router.post("/", createAbility);
router.put("/:id", updateAbility);
router.delete("/:id", deleteAbility);

module.exports = router;