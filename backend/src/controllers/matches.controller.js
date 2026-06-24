/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con partidas.
 * Delega el acceso a datos al model.
 */
const MatchesModel = require("../models/matches.model");

const getMatches = async (req, res) => {
    try {
        const result = await MatchesModel.findAllMatches();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las partidas: " + error.message });
    }
};

const getMatchById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await MatchesModel.findMatchById(id);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la partida: " + error.message });
    }
};

const getMatchesByGameMode = async (req, res) => {
    const { game_mode } = req.query;
    try {
        if (!game_mode) {
            return res.status(400).json({ message: "Debes proporcionar un modo de juego en la query (?game_mode=...)" });
        }
        const result = await MatchesModel.findMatchesByGameMode(game_mode);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por modo de juego: " + error.message });
    }
};

const getMatchesByMapId = async (req, res) => {
    const { map_id } = req.query;
    try {
        if (!map_id) {
            return res.status(400).json({ message: "Debes proporcionar un ID de mapa en la query (?map_id=...)" });
        }
        const result = await MatchesModel.findMatchesByMapId(map_id);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por mapa: " + error.message });
    }
};

const getMatchBasicInfo = async (req, res) => {
    try {
        const result = await MatchesModel.findMatchBasicInfo();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener informaciÃ³n bÃ¡sica de partidas: " + error.message });
    }
};

const createMatch = async (req, res) => {
    const { map_id, game_mode, start_time, duration_seconds } = req.body;

    try {
        const mapCheck = await MatchesModel.findGameMapById(map_id);

        if (mapCheck.rows.length === 0) {
            return res.status(400).json({ message: "El mapa especificado no existe" });
        }

        const result = await MatchesModel.createMatch({
            map_id,
            game_mode,
            start_time,
            duration_seconds
        });

        const matchWithMap = await MatchesModel.findMatchById(result.rows[0].id);

        res.status(201).json(matchWithMap.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando partida: " + error.message
        });
    }
};

const patchMatch = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const matchCheck = await MatchesModel.findMatchExistsById(id);

        if (matchCheck.rows.length === 0) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }

        if (updates.map_id) {
            const mapCheck = await MatchesModel.findGameMapById(updates.map_id);
            if (mapCheck.rows.length === 0) {
                return res.status(400).json({ message: "El mapa especificado no existe" });
            }
        }

        const result = await MatchesModel.patchMatch(id, updates);

        if (!result) {
            return res.status(400).json({ message: "No se proporcionaron campos vÃ¡lidos para actualizar" });
        }

        const matchWithMap = await MatchesModel.findMatchById(id);

        res.status(200).json({
            message: "Partida actualizada parcialmente",
            match: matchWithMap.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualizaciÃ³n parcial: " + error.message });
    }
};

const deleteMatch = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await MatchesModel.deleteMatch(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Partida no encontrada para eliminar" });
        }

        res.status(200).json({
            message: "Partida eliminada exitosamente",
            match: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando partida: " + error.message });
    }
};

module.exports = {
    getMatches,
    getMatchById,
    getMatchesByGameMode,
    getMatchesByMapId,
    getMatchBasicInfo,
    createMatch,
    patchMatch,
    deleteMatch
};
