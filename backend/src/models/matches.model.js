/**
 * Model:
 * Centraliza las consultas SQL de la tabla matches.
 * No gestiona req/res ni decisiones HTTP.
 */
const pool = require("../config/db");

const findAllMatches = async () => {
    return pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            ORDER BY m.id ASC
        `);
};

const findMatchById = async (id) => {
    return pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.id = $1
        `, [id]);
};

const findMatchesByGameMode = async (game_mode) => {
    return pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.game_mode = $1
            ORDER BY m.id ASC
        `, [game_mode]);
};

const findMatchesByMapId = async (map_id) => {
    return pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.map_id = $1
            ORDER BY m.id ASC
        `, [map_id]);
};

const findMatchBasicInfo = async () => {
    return pool.query(`
            SELECT m.id, gm.name as map_name, m.game_mode, m.start_time, m.duration_seconds 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            ORDER BY m.id ASC
        `);
};

const findGameMapById = async (map_id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.game_maps WHERE id = $1",
        [map_id]
    );
};

const findMatchExistsById = async (id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.matches WHERE id = $1",
        [id]
    );
};

const createMatch = async ({ map_id, game_mode, start_time, duration_seconds }) => {
    return pool.query(
        `
            INSERT INTO ducky_arena.matches
            (map_id, game_mode, start_time, duration_seconds)
            VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP), $4)
            RETURNING *
            `,
        [map_id, game_mode, start_time, duration_seconds]
    );
};

// Construye el UPDATE parcial usando solo campos permitidos.
const patchMatch = async (id, updates) => {
    const setClause = [];
    const values = [];
    let paramCount = 1;
    const allowedFields = ['map_id', 'game_mode', 'start_time', 'duration_seconds'];

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

    return pool.query(
        `
            UPDATE ducky_arena.matches 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
        values
    );
};

const deleteMatch = async (id) => {
    return pool.query(
        "DELETE FROM ducky_arena.matches WHERE id = $1 RETURNING *",
        [id]
    );
};

module.exports = {
    findAllMatches,
    findMatchById,
    findMatchesByGameMode,
    findMatchesByMapId,
    findMatchBasicInfo,
    findGameMapById,
    findMatchExistsById,
    createMatch,
    patchMatch,
    deleteMatch
};
