/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con mapas de juego.
 * Delega el acceso a datos al model.
 */
const GameMapsModel = require("../models/game_maps.model");

const getGameMaps = async (req, res) => {
    try {
        const result = await GameMapsModel.findAllGameMaps();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los mapas del juego: " + error.message });
    }
};

const getGameMapById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await GameMapsModel.findGameMapById(id);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el mapa del juego: " + error.message });
    }
};

const getGameMapsByEnvironmentType = async (req, res) => {
    const { environment_type } = req.query;
    try {
        if (!environment_type) {
            return res.status(400).json({ message: "Debes proporcionar un tipo de entorno en la query (?environment_type=...)" });
        }
        const result = await GameMapsModel.findGameMapsByEnvironmentType(environment_type);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por tipo: " + error.message });
    }
};

const getGameMapNames = async (req, res) => {
    try {
        const result = await GameMapsModel.findGameMapNames();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los nombres de los mapas: " + error.message });
    }
};

const createGameMap = async (req, res) => {
    const { name, environment_type } = req.body;

    try {
        const result = await GameMapsModel.createGameMap({ name, environment_type });
        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando mapa del juego: " + error.message
        });
    }
};

const patchGameMap = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const result = await GameMapsModel.patchGameMap(id, updates);

        if (!result) {
            return res.status(400).json({ message: "No se proporcionaron campos vÃ¡lidos para actualizar" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado" });
        }

        res.status(200).json({
            message: "Mapa del juego actualizado parcialmente",
            gameMap: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualizaciÃ³n parcial: " + error.message });
    }
};

const deleteGameMap = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await GameMapsModel.deleteGameMap(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Mapa del juego eliminado exitosamente",
            gameMap: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando mapa del juego: " + error.message });
    }
};

module.exports = {
    getGameMaps,
    getGameMapById,
    getGameMapsByEnvironmentType,
    getGameMapNames,
    createGameMap,
    patchGameMap,
    deleteGameMap
};
