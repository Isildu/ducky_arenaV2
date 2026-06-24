/**
 * Controller
 *
 * Gestiona peticiones HTTP.
 * Valida entrada basica.
 * Delega acceso a datos al model.
 */
const CosmeticsModel = require("../models/cosmetics.model");

const getCosmetics = async (req, res) => {
    try {
        const result = await CosmeticsModel.findAllCosmetics();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo cosmÃ©ticos: " + error.message });
    }
};

const getCosmeticById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await CosmeticsModel.findCosmeticById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "CosmÃ©tico no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo cosmÃ©tico: " + error.message });
    }
};

const createCosmetic = async (req, res) => {
    const { name, type, price, img_url } = req.body;

    try {
        const result = await CosmeticsModel.createCosmetic({
            name,
            type,
            price,
            img_url
        });

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creando cosmÃ©tico: " + error.message });
    }
};

const updateCosmetic = async (req, res) => {
    const { id } = req.params;
    const { name, type, price, img_url } = req.body;

    try {
        const result = await CosmeticsModel.updateCosmetic(id, {
            name,
            type,
            price,
            img_url
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "CosmÃ©tico no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando cosmÃ©tico: " + error.message });
    }
};

const deleteCosmetic = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await CosmeticsModel.deleteCosmetic(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "CosmÃ©tico no encontrado" });
        }

        res.status(200).json({
            message: "CosmÃ©tico eliminado correctamente",
            cosmetic: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Error eliminando cosmÃ©tico: " + error.message });
    }
};

module.exports = {
    getCosmetics,
    getCosmeticById,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic
};
