/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllPlayerCosmetics = async () => {
    return pool.query("SELECT * FROM ducky_arena.player_cosmetics ORDER BY id ASC");
};

const findCosmeticsByProfile = async (profile_id) => {
    return pool.query(
        `
            SELECT pc.id, pc.profile_id, pc.cosmetic_id, pc.is_unlocked, c.name, c.type, c.img_url
            FROM ducky_arena.player_cosmetics pc
            JOIN ducky_arena.cosmetics c ON pc.cosmetic_id = c.id
            WHERE pc.profile_id = $1
            `,
        [profile_id]
    );
};

const findPlayerCosmeticById = async (id) => {
    return pool.query(
        "SELECT * FROM ducky_arena.player_cosmetics WHERE id = $1",
        [id]
    );
};

const unlockCosmetic = async ({ profile_id, cosmetic_id, is_unlocked }) => {
    return pool.query(
        `
            INSERT INTO ducky_arena.player_cosmetics (profile_id, cosmetic_id, is_unlocked)
            VALUES ($1, $2, COALESCE($3, FALSE))
            RETURNING *
            `,
        [profile_id, cosmetic_id, is_unlocked]
    );
};

const updateCosmeticStatus = async (id, is_unlocked) => {
    return pool.query(
        `
            UPDATE ducky_arena.player_cosmetics
            SET is_unlocked = $1
            WHERE id = $2
            RETURNING *
            `,
        [is_unlocked, id]
    );
};

const deleteCosmeticFromPlayer = async (id) => {
    return pool.query("DELETE FROM ducky_arena.player_cosmetics WHERE id = $1 RETURNING *", [id]);
};

module.exports = {
    findAllPlayerCosmetics,
    findCosmeticsByProfile,
    findPlayerCosmeticById,
    unlockCosmetic,
    updateCosmeticStatus,
    deleteCosmeticFromPlayer
};
