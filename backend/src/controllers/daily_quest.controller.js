/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con quests diarios.
 * Delega el acceso a datos al model.
 */
const DailyQuestModel = require("../models/daily_quest.model");

const getDailyQuests = async (req, res) => {
    try {
        const result = await DailyQuestModel.findAllDailyQuests();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los quests diarios: " + error.message });
    }
};

const getDailyQuestsById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await DailyQuestModel.findDailyQuestById(id);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el quest diario: " + error.message });
    }
};

const getReward = async (req, res) => {
    const { reward_coins } = req.query;

    if (!reward_coins) {
        return res.status(400).json({
            message: "Debes proporcionar reward_coins en la query (?reward_coins=...)"
        });
    }

    const result = await DailyQuestModel.findDailyQuestsByReward(reward_coins);
    res.status(200).json(result.rows);
};

const getDescription = async (req, res) => {
    try {
        const result = await DailyQuestModel.findDailyQuestDescriptions();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las descripciones: " + error.message });
    }
};

const createDailyQuest = async (req, res) => {
    const { description, reward_coins } = req.body;

    try {
        const result = await DailyQuestModel.createDailyQuest({ description, reward_coins });
        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando quest diario: " + error.message
        });
    }
};

const patchDailyQuest = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await DailyQuestModel.patchDailyQuest(id, updates);

        if (!result) {
            return res.status(400).json({ message: "No se proporcionaron campos vÃ¡lidos para actualizar" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado" });
        }

        res.status(200).json({
            message: "Quest diario actualizado parcialmente",
            dailyQuest: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualizaciÃ³n parcial: " + error.message });
    }
};

const deleteDailyQuest = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await DailyQuestModel.deleteDailyQuest(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Quest diario eliminado exitosamente",
            dailyQuest: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando quest diario: " + error.message });
    }
};

module.exports = {
    getDailyQuests,
    getDailyQuestsById,
    getReward,
    getDescription,
    createDailyQuest,
    patchDailyQuest,
    deleteDailyQuest
};
