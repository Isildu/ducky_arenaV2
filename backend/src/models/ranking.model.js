/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findRankingByLevel = async () => {
    return pool.query(
        `
            SELECT
                pp.id,
                pp.user_id,
                au.username,
                pp.level,
                pp.experience,
                pp.bread_coins
            FROM ducky_arena.player_profile pp
            JOIN ducky_arena.auth_user au ON pp.user_id = au.id
            ORDER BY pp.level DESC, pp.experience DESC, pp.id ASC
            `
    );
};

module.exports = {
    findRankingByLevel
};
