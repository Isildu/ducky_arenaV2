/**
 * Controller
 *
 * Gestiona peticiones HTTP.
 * Valida entrada basica.
 * Delega acceso a datos al model.
 */
const CharactersModel = require("../models/characters.model");

const getCharacters = async (req, res) => {
    try {
        const result = await CharactersModel.findAllCharacters();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los personajes: " + error.message });
    }
};

const getCharactersById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await CharactersModel.findCharacterById(id);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el personaje: " + error.message });
    }
};

const getCharacterAbilities = async (req, res) => {
    const { id } = req.params;
    try {
        const character = await CharactersModel.findCharacterById(id);

        if (character.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }

        const abilities = await CharactersModel.findAbilitiesByCharacterId(id);
        res.status(200).json({
            character: character.rows[0],
            abilities: abilities.rows
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener habilidades del personaje: " + error.message });
    }
};

const getRole = async (req, res) => {
    const { type } = req.query; 
    try {
        if (!type) {
            return res.status(400).json({ message: "Debes proporcionar un tipo de rol en la query (?type=...)" });
        }
        const result = await CharactersModel.findCharactersByRole(type);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por rol: " + error.message });
    }
};

const getName = async (req, res) => {
    try {
        const result = await CharactersModel.findCharacterNames();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los nombres: " + error.message });
    }
};

const createCharacter = async (req, res) => {
    const { name, role, base_health, attack_damage, endurance } = req.body;

    try {
        const result = await CharactersModel.createCharacter({
            name,
            role,
            base_health,
            attack_damage,
            endurance
        });

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando personaje: " + error.message
        });
    }
};

const updateCharacter = async (req, res) => {
    const { id } = req.params;
    const { name, role, base_health, attack_damage, endurance } = req.body;

    try {
        const result = await CharactersModel.updateCharacter(id, {
            name,
            role,
            base_health,
            attack_damage,
            endurance
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: "Error actualizando personaje: " + error.message
        });
    }
};

const deleteCharacter = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await CharactersModel.deleteCharacter(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }

        res.status(200).json({
            message: "Personaje eliminado correctamente",
            character: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            error: "Error eliminando personaje: " + error.message
        });
    }
};

module.exports = {
    getCharacters,
    getCharactersById,
    getCharacterAbilities,
    getRole,
    getName,
    createCharacter,
    updateCharacter,
    deleteCharacter
};
