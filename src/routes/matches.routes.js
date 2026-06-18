// matches.routes.js
const express = require('express');
const router = express.Router();
const {
    getMatches,
    getMatchById,
    getMatchesByGameMode,
    getMatchesByMapId,
    getMatchBasicInfo,
    createMatch,
    patchMatch,
    deleteMatch
} = require('../controllers/matches.controller');

// 📋 RUTAS READ (GET)
// Obtener todas las partidas
router.get('/', getMatches);

// Obtener información básica de partidas (solo ID, mapa, modo, tiempo)
router.get('/basic', getMatchBasicInfo);

// Obtener partidas por modo de juego (query: ?game_mode=)
router.get('/by-game-mode', getMatchesByGameMode);

// Obtener partidas por mapa (query: ?map_id=)
router.get('/by-map', getMatchesByMapId);

// Obtener una partida por ID
router.get('/:id', getMatchById);

// ✨ RUTA CREATE (POST)
router.post('/', createMatch);

// 🔄 RUTA UPDATE PARCIAL (PATCH)
router.patch('/:id', patchMatch);

// 🗑️ RUTA DELETE
router.delete('/:id', deleteMatch);

module.exports = router;