/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const express = require('express');
const router = express.Router();
const validateId = require("../middleware/validate_id.middleware");
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

router.get('/:id', validateId, getMatchById);

router.post('/', createMatch);

router.put('/:id', validateId, patchMatch);

router.patch('/:id', validateId, patchMatch);

router.delete('/:id', validateId, deleteMatch);

module.exports = router;
