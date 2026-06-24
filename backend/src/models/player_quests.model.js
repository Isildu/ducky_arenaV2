/**
 * Model:
 * Centraliza las consultas SQL de la tabla player_quests.
 * No gestiona req/res ni decisiones HTTP.
 */
const pool = require("../config/db");

const findAllPlayerQuests = async () => {
    return pool.query("SELECT * FROM ducky_arena.player_quests ORDER BY id ASC");
};

const findQuestsByProfile = async (profile_id) => {
    return pool.query(
        `
            SELECT pq.id, pq.profile_id, pq.quest_id, pq.is_completed, dq.description, dq.reward_coins
            FROM ducky_arena.player_quests pq
            JOIN ducky_arena.daily_quest dq ON pq.quest_id = dq.id
            WHERE pq.profile_id = $1
            `,
        [profile_id]
    );
};

const findPlayerQuestById = async (id) => {
    return pool.query(
        "SELECT * FROM ducky_arena.player_quests WHERE id = $1",
        [id]
    );
};

const assignQuest = async ({ profile_id, quest_id, is_completed }) => {
    return pool.query(
        `
            INSERT INTO ducky_arena.player_quests (profile_id, quest_id, is_completed)
            VALUES ($1, $2, COALESCE($3, FALSE))
            RETURNING *
            `,
        [profile_id, quest_id, is_completed]
    );
};

const updateQuestStatus = async (id, is_completed) => {
    return pool.query(
        `
            UPDATE ducky_arena.player_quests
            SET is_completed = $1
            WHERE id = $2
            RETURNING *
            `,
        [is_completed, id]
    );
};

const deleteQuestFromPlayer = async (id) => {
    return pool.query("DELETE FROM ducky_arena.player_quests WHERE id = $1 RETURNING *", [id]);
};

module.exports = {
    findAllPlayerQuests,
    findQuestsByProfile,
    findPlayerQuestById,
    assignQuest,
    updateQuestStatus,
    deleteQuestFromPlayer
};
