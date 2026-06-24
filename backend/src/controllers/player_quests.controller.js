/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con misiones de jugadores.
 * Delega el acceso a datos al model.
 */
const PlayerQuestsModel = require("../models/player_quests.model");

const getPlayerQuests = async (req, res) => {
    try {
        const result = await PlayerQuestsModel.findAllPlayerQuests();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las misiones globales: " + error.message });
    }
};

const getQuestsByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await PlayerQuestsModel.findQuestsByProfile(profile_id);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las misiones del jugador: " + error.message });
    }
};

const getPlayerQuestById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerQuestsModel.findPlayerQuestById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de mision no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la mision del jugador: " + error.message });
    }
};

const assignQuest = async (req, res) => {
    const { profile_id, quest_id, is_completed } = req.body;
    try {
        const result = await PlayerQuestsModel.assignQuest({ profile_id, quest_id, is_completed });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al asignar la misiÃ³n: " + error.message });
    }
};

const updateQuestStatus = async (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body;
    try {
        const result = await PlayerQuestsModel.updateQuestStatus(id, is_completed);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de misiÃ³n no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado de la misiÃ³n: " + error.message });
    }
};

const removeQuestFromPlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerQuestsModel.deleteQuestFromPlayer(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de misiÃ³n no encontrado para eliminar" });
        }

        res.status(200).json({ message: "MisiÃ³n retirada correctamente del jugador", deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la misiÃ³n: " + error.message });
    }
};

module.exports = {
    getPlayerQuests,
    getQuestsByProfile,
    getPlayerQuestById,
    assignQuest,
    updateQuestStatus,
    removeQuestFromPlayer
};
