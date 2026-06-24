/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con perfiles de jugador.
 * Delega el acceso a datos al model.
 */
const PlayerProfileModel = require("../models/player_profile.model");

const getPlayerProfiles = async (req, res) => {
    try {
        const result = await PlayerProfileModel.findAllPlayerProfiles();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los perfiles: " + error.message });
    }
};

const getPlayerProfileById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerProfileModel.findPlayerProfileById(id);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Perfil de jugador no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil: " + error.message });
    }
};

const createPlayerProfile = async (req, res) => {
    const { user_id, level, experience, bread_coins } = req.body;
    try {
        const result = await PlayerProfileModel.createPlayerProfile({ user_id, level, experience, bread_coins });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el perfil: " + error.message });
    }
};

const updatePlayerProfile = async (req, res) => {
    const { id } = req.params;
    const { level, experience, bread_coins } = req.body;
    try {
        const result = await PlayerProfileModel.updatePlayerProfile(id, { level, experience, bread_coins });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Perfil no encontrado para actualizar" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el perfil: " + error.message });
    }
};

const deletePlayerProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerProfileModel.deletePlayerProfile(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Perfil no encontrado para eliminar" });
        }

        res.status(200).json({ message: "Perfil de jugador eliminado correctamente", profile: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el perfil: " + error.message });
    }
};

module.exports = {
    getPlayerProfiles,
    getPlayerProfileById,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
};
