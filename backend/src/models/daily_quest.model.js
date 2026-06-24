/**
 * Model:
 * Centraliza las consultas SQL de la tabla daily_quest.
 * No gestiona req/res ni decisiones HTTP.
 */
const pool = require("../config/db");

const findAllDailyQuests = async () => {
    const result = await pool.query("SELECT * FROM ducky_arena.daily_quest ORDER BY id ASC");
    return result;
};

const findDailyQuestById = async (id) => {
    const result = await pool.query("SELECT * FROM ducky_arena.daily_quest WHERE id = $1", [id]);
    return result;
};

const findDailyQuestsByReward = async (reward_coins) => {
    const result = await pool.query(
        `SELECT * FROM ducky_arena.daily_quest WHERE reward_coins = $1`,
        [reward_coins]
    );
    return result;
};

const findDailyQuestDescriptions = async () => {
    const result = await pool.query("SELECT id, description FROM ducky_arena.daily_quest ORDER BY description ASC");
    return result;
};

const createDailyQuest = async ({ description, reward_coins }) => {
    const result = await pool.query(
        `
            INSERT INTO ducky_arena.daily_quest
            (description, reward_coins)
            VALUES ($1,$2)
            RETURNING *
            `,
        [description, reward_coins]
    );
    return result;
};

// Construye el UPDATE parcial usando solo campos permitidos.
const patchDailyQuest = async (id, updates) => {
    const setClause = [];
    const values = [];
    let paramCount = 1;
    const allowedFields = ['description', 'reward_coins'];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            setClause.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    }

    if (setClause.length === 0) {
        return null;
    }

    values.push(id);

    const result = await pool.query(
        `
            UPDATE ducky_arena.daily_quest
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
        values
    );

    return result;
};

const deleteDailyQuest = async (id) => {
    const result = await pool.query(
        "DELETE FROM ducky_arena.daily_quest WHERE id = $1 RETURNING *",
        [id]
    );
    return result;
};

module.exports = {
    findAllDailyQuests,
    findDailyQuestById,
    findDailyQuestsByReward,
    findDailyQuestDescriptions,
    createDailyQuest,
    patchDailyQuest,
    deleteDailyQuest
};
