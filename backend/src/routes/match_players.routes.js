/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
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
} = require('../controllers/match_players.controller');


router.get('/', getMatchPlayers);

router.get('/by-match', getMatchPlayersByMatchId);

router.get('/by-team', getMatchPlayersByTeam);

router.get('/winners', getMatchWinners);

router.get('/player-stats', getPlayerMatchStats);

router.get('/:id', getMatchPlayerById);

router.post('/', createMatchPlayer);

router.put('/:id', patchMatchPlayer);

router.patch('/:id', patchMatchPlayer);

router.delete('/:id', deleteMatchPlayer);

module.exports = router;
