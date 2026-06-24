/**
 * Routes
 *
 * Define endpoints publicos del modulo.
 */
const router = require("express").Router();

const {
    getRanking
} = require("../controllers/ranking.controller");

router.get("/", getRanking);

module.exports = router;
