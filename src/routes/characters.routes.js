const router = require("express").Router();

const {
    getCharacters,
    getCharactersById,
    getRole,
    getName
} = require("../controllers/characters.controller");

router.get("/", getName);             // Devuelve id y nombre de todos
router.get("/role", getRole);         // Filtra por rol usando ?type=VALOR
router.get("/all", getCharacters);     // Devuelve todos los personajes completos
router.get("/:id", getCharactersById); // Devuelve el personaje completo por su ID

module.exports = router;