/**
 * Controller
 *
 * Gestiona peticiones HTTP.
 * Valida entrada basica.
 * Delega acceso a datos al model.
 */
const PlayerCosmeticsModel = require("../models/player_cosmetics.model");

const getPlayerCosmetics = async (req, res) => {
    try {
        const result = await PlayerCosmeticsModel.findAllPlayerCosmetics();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los cosmÃ©ticos de los jugadores: " + error.message });
    }
};

const getCosmeticsByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await PlayerCosmeticsModel.findCosmeticsByProfile(profile_id);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el inventario del jugador: " + error.message });
    }
};

const getPlayerCosmeticById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerCosmeticsModel.findPlayerCosmeticById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de cosmetico no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el cosmetico del jugador: " + error.message });
    }
};

const unlockCosmetic = async (req, res) => {
    const { profile_id, cosmetic_id, is_unlocked } = req.body;
    try {
        const result = await PlayerCosmeticsModel.unlockCosmetic({ profile_id, cosmetic_id, is_unlocked });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al asignar el cosmÃ©tico: " + error.message });
    }
};

const updateCosmeticStatus = async (req, res) => {
    const { id } = req.params;
    const { is_unlocked } = req.body;
    try {
        const result = await PlayerCosmeticsModel.updateCosmeticStatus(id, is_unlocked);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de cosmÃ©tico no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el cosmÃ©tico: " + error.message });
    }
};

const removeCosmeticFromPlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerCosmeticsModel.deleteCosmeticFromPlayer(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado para eliminar" });
        }

        res.status(200).json({ message: "CosmÃ©tico retirado del inventario del jugador", deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al retirar el cosmÃ©tico: " + error.message });
    }
};

module.exports = {
    getPlayerCosmetics,
    getCosmeticsByProfile,
    getPlayerCosmeticById,
    unlockCosmetic,
    updateCosmeticStatus,
    removeCosmeticFromPlayer
};
