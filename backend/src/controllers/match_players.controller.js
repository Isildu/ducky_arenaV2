/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con jugadores en partidas.
 * Delega el acceso a datos al model.
 */
const MatchPlayersModel = require("../models/match_players.model");

const getMatchPlayers = async (req, res) => {
    try {
        const result = await MatchPlayersModel.findAllMatchPlayers();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los jugadores de partidas: " + error.message });
    }
};

const getMatchPlayerById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await MatchPlayersModel.findMatchPlayerById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de jugador en partida no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el registro: " + error.message });
    }
};

const getMatchPlayersByMatchId = async (req, res) => {
    const { match_id } = req.query;

    try {
        if (!match_id) {
            return res.status(400).json({
                message: "Debes proporcionar un ID de partida en la query (?match_id=...)"
            });
        }

        const result = await MatchPlayersModel.findMatchPlayersByMatchId(match_id);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: "Error al filtrar jugadores por partida: " + error.message
        });
    }
};

const getMatchPlayersByTeam = async (req, res) => {
    const { match_id, team } = req.query;
    try {
        if (!match_id || !team) {
            return res.status(400).json({
                message: "Debes proporcionar match_id y team en la query (?match_id=...&team=...)"
            });
        }
        const result = await MatchPlayersModel.findMatchPlayersByTeam(match_id, team);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por equipo: " + error.message });
    }
};

const getMatchWinners = async (req, res) => {
    const { match_id } = req.query;
    try {
        if (!match_id) {
            return res.status(400).json({ message: "Debes proporcionar un ID de partida en la query (?match_id=...)" });
        }
        const result = await MatchPlayersModel.findMatchWinners(match_id);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener ganadores: " + error.message });
    }
};

const getPlayerMatchStats = async (req, res) => {
    const { profile_id } = req.query;
    try {
        if (!profile_id) {
            return res.status(400).json({ message: "Debes proporcionar un profile_id en la query (?profile_id=...)" });
        }
        const result = await MatchPlayersModel.findPlayerMatchStats(profile_id);

        const stats = {
            total_matches: result.rows.length,
            total_kills: result.rows.reduce((sum, row) => sum + row.kills, 0),
            total_deaths: result.rows.reduce((sum, row) => sum + row.deaths, 0),
            wins: result.rows.filter(row => row.is_winner).length,
            matches: result.rows
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener estadÃ­sticas del jugador: " + error.message });
    }
};

const createMatchPlayer = async (req, res) => {
    const { match_id, profile_id, character_id, team, is_winner, kills, deaths } = req.body;

    try {
        const matchCheck = await MatchPlayersModel.findMatchExistsById(match_id);
        if (matchCheck.rows.length === 0) {
            return res.status(400).json({ message: "La partida especificada no existe" });
        }

        const characterCheck = await MatchPlayersModel.findCharacterExistsById(character_id);
        if (characterCheck.rows.length === 0) {
            return res.status(400).json({ message: "El personaje especificado no existe" });
        }

        const profileCheck = await MatchPlayersModel.findPlayerProfileExistsById(profile_id);
        if (profileCheck.rows.length === 0) {
            return res.status(400).json({ message: "El perfil de jugador especificado no existe" });
        }

        const existingCheck = await MatchPlayersModel.findExistingMatchPlayer(match_id, profile_id);
        if (existingCheck.rows.length > 0) {
            return res.status(400).json({
                message: "Este jugador ya estÃ¡ registrado en esta partida"
            });
        }

        const result = await MatchPlayersModel.createMatchPlayer({
            match_id,
            profile_id,
            character_id,
            team,
            is_winner,
            kills,
            deaths
        });

        const matchPlayerWithInfo = await MatchPlayersModel.findMatchPlayerInfoById(result.rows[0].id);
        res.status(201).json(matchPlayerWithInfo.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error agregando jugador a la partida: " + error.message
        });
    }
};

const patchMatchPlayer = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const check = await MatchPlayersModel.findMatchPlayerExistsById(id);
        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        if (updates.character_id) {
            const characterCheck = await MatchPlayersModel.findCharacterExistsById(updates.character_id);
            if (characterCheck.rows.length === 0) {
                return res.status(400).json({ message: "El personaje especificado no existe" });
            }
        }

        const result = await MatchPlayersModel.patchMatchPlayer(id, updates);

        if (!result) {
            return res.status(400).json({ message: "No se proporcionaron campos vÃ¡lidos para actualizar" });
        }

        const matchPlayerWithInfo = await MatchPlayersModel.findMatchPlayerInfoById(id);

        res.status(200).json({
            message: "EstadÃ­sticas de jugador actualizadas parcialmente",
            matchPlayer: matchPlayerWithInfo.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualizaciÃ³n parcial: " + error.message });
    }
};

const deleteMatchPlayer = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await MatchPlayersModel.deleteMatchPlayer(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Jugador eliminado de la partida exitosamente",
            matchPlayer: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando jugador de la partida: " + error.message });
    }
};

module.exports = {
    getMatchPlayers,
    getMatchPlayerById,
    getMatchPlayersByMatchId,
    getMatchPlayersByTeam,
    getMatchWinners,
    getPlayerMatchStats,
    createMatchPlayer,
    patchMatchPlayer,
    deleteMatchPlayer
};
