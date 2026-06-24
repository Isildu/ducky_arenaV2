const express = require('express');
const router = express.Router();
const {
    getMatchPlayers,
    getMatchPlayerById,
    getMatchPlayersByMatchId,
    getMatchPlayersByTeam,
    getMatchWinners,
    getPlayerMatchStats,
    createMatchPlayer,
    patchMatchPlayer,
    deleteMatchPlayer
} = require('../controllers/matchPlayers.controller');

// 📋 RUTAS READ (GET)

// Obtener todos los registros de jugadores en partidas
router.get('/', getMatchPlayers);

// Obtener jugadores por partida (query: ?match_id=)
router.get('/by-match', getMatchPlayersByMatchId);

// Obtener jugadores por equipo en partida (query: ?match_id=&team=)
router.get('/by-team', getMatchPlayersByTeam);

// Obtener ganadores de partida (query: ?match_id=)
router.get('/winners', getMatchWinners);

// Obtener estadísticas de un jugador (query: ?profile_id=)
router.get('/player-stats', getPlayerMatchStats);

// Obtener registro por ID (DEBE IR AL FINAL DE LAS RUTAS GET)
router.get('/:id', getMatchPlayerById);

// ✨ CREATE - Agregar jugador a partida
router.post('/', createMatchPlayer);

// PUT reutiliza la actualizacion parcial existente para mantener compatibilidad.
router.put('/:id', patchMatchPlayer);

// 🔄 UPDATE - Actualización parcial
router.patch('/:id', patchMatchPlayer);

// 🗑️ DELETE - Eliminar jugador de partida
router.delete('/:id', deleteMatchPlayer);

module.exports = router;
