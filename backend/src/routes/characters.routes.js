/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

const {
    getCharacters,
    getCharactersById,
    getRole,
    getName,
    createCharacter,
    updateCharacter,
    deleteCharacter
} = require("../controllers/characters.controller");

router.get("/", getName);
router.get("/role", getRole);
router.get("/all", getCharacters);
router.get("/:id", getCharactersById);

router.post("/", createCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

module.exports = router;