/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require("express");
const router = express.Router();
const validateId = require("../middleware/validate_id.middleware");

const {
    getAbilities,
    getAbilityById,
    createAbility,
    updateAbility,
    deleteAbility
} = require("../controllers/abilities.controller");

router.get("/", getAbilities);
router.get("/:id", validateId, getAbilityById);
router.post("/", createAbility);
router.put("/:id", validateId, updateAbility);
router.delete("/:id", validateId, deleteAbility);

module.exports = router;
