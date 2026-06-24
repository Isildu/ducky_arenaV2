/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require('express');
const router = express.Router();
const validateId = require("../middleware/validate_id.middleware");
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

router.get('/:id', validateId, getMatchPlayerById);

router.post('/', createMatchPlayer);

router.put('/:id', validateId, patchMatchPlayer);

router.patch('/:id', validateId, patchMatchPlayer);

router.delete('/:id', validateId, deleteMatchPlayer);

module.exports = router;
