/**
 * Controller
 *
 * Gestiona peticiones HTTP.
 * Valida entrada basica.
 * Delega acceso a datos al model.
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

const getPlayerDashboard = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await PlayerProfileModel.findPlayerDashboardProfile(id);

        if (profile.rows.length === 0) {
            return res.status(404).json({ message: "Perfil de jugador no encontrado" });
        }

        const recentMatches = await PlayerProfileModel.findRecentMatchesByProfile(id);
        const activeQuests = await PlayerProfileModel.findActiveQuestsByProfile(id);
        const unlockedCosmetics = await PlayerProfileModel.findUnlockedCosmeticsByProfile(id);

        res.status(200).json({
            profile: profile.rows[0],
            recent_matches: recentMatches.rows,
            active_quests: activeQuests.rows,
            unlocked_cosmetics: unlockedCosmetics.rows
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el dashboard del perfil: " + error.message });
    }
};

const getPlayerStats = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await PlayerProfileModel.findPlayerProfileById(id);

        if (profile.rows.length === 0) {
            return res.status(404).json({ message: "Perfil de jugador no encontrado" });
        }

        const result = await PlayerProfileModel.findPlayerStats(id);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener estadisticas del perfil: " + error.message });
    }
};

const getPlayerInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await PlayerProfileModel.findPlayerProfileById(id);

        if (profile.rows.length === 0) {
            return res.status(404).json({ message: "Perfil de jugador no encontrado" });
        }

        const cosmetics = await PlayerProfileModel.findInventoryCosmeticsByProfile(id);
        res.status(200).json({ cosmetics: cosmetics.rows });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el inventario del perfil: " + error.message });
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
    getPlayerDashboard,
    getPlayerStats,
    getPlayerInventory,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
};
