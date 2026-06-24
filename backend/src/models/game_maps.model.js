/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllGameMaps = async () => {
    const result = await pool.query("SELECT * FROM ducky_arena.game_maps ORDER BY id ASC");
    return result;
};

const findGameMapById = async (id) => {
    const result = await pool.query("SELECT * FROM ducky_arena.game_maps WHERE id = $1", [id]);
    return result;
};

const findGameMapsByEnvironmentType = async (environment_type) => {
    const result = await pool.query("SELECT * FROM ducky_arena.game_maps WHERE environment_type = $1", [environment_type]);
    return result;
};

const findGameMapNames = async () => {
    const result = await pool.query("SELECT id, name FROM ducky_arena.game_maps ORDER BY id ASC");
    return result;
};

const createGameMap = async ({ name, environment_type }) => {
    const result = await pool.query(
        `
            INSERT INTO ducky_arena.game_maps
            (name, environment_type)
            VALUES ($1,$2)
            RETURNING *
            `,
        [name, environment_type]
    );
    return result;
};

const patchGameMap = async (id, updates) => {
    const setClause = [];
    const values = [];
    let paramCount = 1;
    const allowedFields = ['name', 'environment_type'];

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
            UPDATE ducky_arena.game_maps 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
        values
    );

    return result;
};

const deleteGameMap = async (id) => {
    const result = await pool.query(
        "DELETE FROM ducky_arena.game_maps WHERE id = $1 RETURNING *",
        [id]
    );
    return result;
};

module.exports = {
    findAllGameMaps,
    findGameMapById,
    findGameMapsByEnvironmentType,
    findGameMapNames,
    createGameMap,
    patchGameMap,
    deleteGameMap
};
