const router = require("express").Router();

const {
 getCharacters,
 getCharactersById,
 getRole,
 getName,
 createCharacter
} = require("../controllers/characters.controller.js");

router.get("/all", getCharacters);     // Devuelve todos los personajes completos
router.get("/role", getRole);         // Filtra por rol usando ?type=VALOR
router.get("/", getName);             // Devuelve id y nombre de todos

router.get("/:id", getCharactersById); // Devuelve el personaje completo por su ID

router.post("/", createCharacter);

module.exports = router;