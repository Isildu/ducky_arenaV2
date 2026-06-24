/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();
const validateId = require("../middleware/validate_id.middleware");

const {
    getCharacters,
    getCharactersById,
    getCharacterAbilities,
    getRole,
    getName,
    createCharacter,
    updateCharacter,
    deleteCharacter
} = require("../controllers/characters.controller");

router.get("/", getName);
router.get("/role", getRole);
router.get("/all", getCharacters);
router.get("/:id/abilities", validateId, getCharacterAbilities);
router.get("/:id", validateId, getCharactersById);

router.post("/", createCharacter);
router.put("/:id", validateId, updateCharacter);
router.delete("/:id", validateId, deleteCharacter);

module.exports = router;
