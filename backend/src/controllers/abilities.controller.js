/**
 * Controller
 *
 * Gestiona peticiones HTTP.
 * Valida entrada basica.
 * Delega acceso a datos al model.
 */
const AbilitiesModel = require("../models/abilities.model");

const getAbilities = async (req, res) => {
    try {
        const result = await AbilitiesModel.findAllAbilities();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo habilidades: " + error.message });
    }
};

const getAbilityById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await AbilitiesModel.findAbilityById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habilidad no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo habilidad: " + error.message });
    }
};

const createAbility = async (req, res) => {
    const { character_id, input_key, name, cooldown } = req.body;

    try {
        const result = await AbilitiesModel.createAbility({
            character_id,
            input_key,
            name,
            cooldown
        });

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creando habilidad: " + error.message });
    }
};

const updateAbility = async (req, res) => {
    const { id } = req.params;
    const { character_id, input_key, name, cooldown } = req.body;

    try {
        const result = await AbilitiesModel.updateAbility(id, {
            character_id,
            input_key,
            name,
            cooldown
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habilidad no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando habilidad: " + error.message });
    }
};

const deleteAbility = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await AbilitiesModel.deleteAbility(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habilidad no encontrada" });
        }

        res.status(200).json({
            message: "Habilidad eliminada correctamente",
            ability: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Error eliminando habilidad: " + error.message });
    }
};

module.exports = {
    getAbilities,
    getAbilityById,
    createAbility,
    updateAbility,
    deleteAbility
};
