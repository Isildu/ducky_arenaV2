/**
 * Controller
 *
 * Gestiona peticiones HTTP.
 * Valida entrada basica.
 * Delega acceso a datos al model.
 */
const RankingModel = require("../models/ranking.model");

const getRanking = async (req, res) => {
    try {
        const result = await RankingModel.findRankingByLevel();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el ranking: " + error.message });
    }
};

module.exports = {
    getRanking
};
