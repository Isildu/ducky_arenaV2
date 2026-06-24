/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
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

router.get('/', getMatches);

router.get('/basic', getMatchBasicInfo);

router.get('/by-game-mode', getMatchesByGameMode);

router.get('/by-map', getMatchesByMapId);

router.get('/:id', getMatchById);

router.post('/', createMatch);

router.put('/:id', patchMatch);

router.patch('/:id', patchMatch);

router.delete('/:id', deleteMatch);

module.exports = router;
