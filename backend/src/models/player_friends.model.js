/**
 * Model:
 * Centraliza las consultas SQL de la tabla player_friends.
 * No gestiona req/res ni decisiones HTTP.
 */
const pool = require("../config/db");

const findAllPlayerFriends = async () => {
    return pool.query("SELECT * FROM ducky_arena.player_friends ORDER BY id ASC");
};

const findFriendsByProfile = async (profile_id) => {
    return pool.query(
        `
            SELECT pf.id, pf.friend_id, pf.status, c.name AS favorite_character
            FROM ducky_arena.player_friends pf
            JOIN ducky_arena.characters c ON pf.character_id = c.id
            WHERE pf.profile_id = $1
            `,
        [profile_id]
    );
};

const findFriendById = async (id) => {
    return pool.query(
        "SELECT * FROM ducky_arena.player_friends WHERE id = $1",
        [id]
    );
};

const createFriendRequest = async ({ character_id, profile_id, friend_id, status }) => {
    return pool.query(
        `
            INSERT INTO ducky_arena.player_friends (character_id, profile_id, friend_id, status)
            VALUES ($1, $2, $3, COALESCE($4, 'PENDING'))
            RETURNING *
            `,
        [character_id, profile_id, friend_id, status]
    );
};

const updateFriendStatus = async (id, status) => {
    return pool.query(
        `
            UPDATE ducky_arena.player_friends
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
        [status, id]
    );
};

const deleteFriendship = async (id) => {
    return pool.query("DELETE FROM ducky_arena.player_friends WHERE id = $1 RETURNING *", [id]);
};

module.exports = {
    findAllPlayerFriends,
    findFriendsByProfile,
    findFriendById,
    createFriendRequest,
    updateFriendStatus,
    deleteFriendship
};
