/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllPlayerProfiles = async () => {
    return pool.query("SELECT * FROM ducky_arena.player_profile ORDER BY id ASC");
};

const findPlayerProfileById = async (id) => {
    return pool.query("SELECT * FROM ducky_arena.player_profile WHERE id = $1", [id]);
};

const createPlayerProfile = async ({ user_id, level, experience, bread_coins }) => {
    return pool.query(
        `
            INSERT INTO ducky_arena.player_profile (user_id, level, experience, bread_coins)
            VALUES ($1, COALESCE($2, 1), COALESCE($3, 0), COALESCE($4, 0))
            RETURNING *
            `,
        [user_id, level, experience, bread_coins]
    );
};

const updatePlayerProfile = async (id, { level, experience, bread_coins }) => {
    return pool.query(
        `
            UPDATE ducky_arena.player_profile
            SET level = $1, experience = $2, bread_coins = $3
            WHERE id = $4
            RETURNING *
            `,
        [level, experience, bread_coins, id]
    );
};

const deletePlayerProfile = async (id) => {
    return pool.query("DELETE FROM ducky_arena.player_profile WHERE id = $1 RETURNING *", [id]);
};

module.exports = {
    findAllPlayerProfiles,
    findPlayerProfileById,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
};
