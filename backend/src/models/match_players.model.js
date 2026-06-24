/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllMatchPlayers = async () => {
    return pool.query(`
            SELECT 
                mp.*,
                m.game_mode as match_game_mode,
                gm.name as map_name,
                u.username as player_username,
                c.name as character_name,
                c.role as character_role
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.matches m ON mp.match_id = m.id
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            LEFT JOIN ducky_arena.player_profile p ON mp.profile_id = p.id
            LEFT JOIN ducky_arena.auth_user u ON p.user_id = u.id
            LEFT JOIN ducky_arena.characters c ON mp.character_id = c.id
            ORDER BY mp.id ASC
        `);
};

const findMatchPlayerById = async (id) => {
    return pool.query(`
            SELECT 
                mp.*,
                m.game_mode as match_game_mode,
                gm.name as map_name,
                u.username as player_username,
                c.name as character_name,
                c.role as character_role
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.matches m ON mp.match_id = m.id
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            LEFT JOIN ducky_arena.player_profile p ON mp.profile_id = p.id
            LEFT JOIN ducky_arena.auth_user u ON p.user_id = u.id
            LEFT JOIN ducky_arena.characters c ON mp.character_id = c.id
            WHERE mp.id = $1
        `, [id]);
};

const findMatchPlayersByMatchId = async (match_id) => {
    return pool.query(`
            SELECT 
                mp.*,
                u.username as player_username,
                c.name as character_name,
                c.role as character_role,
                c.base_health as character_health,
                c.endurance as character_endurance
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.player_profile p ON mp.profile_id = p.id
            LEFT JOIN ducky_arena.auth_user u ON p.user_id = u.id
            LEFT JOIN ducky_arena.characters c ON mp.character_id = c.id
            WHERE mp.match_id = $1
            ORDER BY mp.team ASC, mp.kills DESC
        `, [match_id]);
};

const findMatchPlayersByTeam = async (match_id, team) => {
    return pool.query(`
            SELECT 
                mp.*,
                u.username as player_username,
                c.name as character_name,
                c.role as character_role
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.player_profile p ON mp.profile_id = p.id
            LEFT JOIN ducky_arena.auth_user u ON p.user_id = u.id
            LEFT JOIN ducky_arena.characters c ON mp.character_id = c.id
            WHERE mp.match_id = $1 AND mp.team = $2
            ORDER BY mp.kills DESC
        `, [match_id, team]);
};

const findMatchWinners = async (match_id) => {
    return pool.query(`
            SELECT 
                mp.*,
                u.username as player_username,
                c.name as character_name
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.player_profile p ON mp.profile_id = p.id
            LEFT JOIN ducky_arena.auth_user u ON p.user_id = u.id
            LEFT JOIN ducky_arena.characters c ON mp.character_id = c.id
            WHERE mp.match_id = $1 AND mp.is_winner = true
            ORDER BY mp.kills DESC
        `, [match_id]);
};

const findPlayerMatchStats = async (profile_id) => {
    return pool.query(`
            SELECT 
                mp.*,
                m.game_mode,
                gm.name as map_name,
                m.start_time,
                m.duration_seconds
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.matches m ON mp.match_id = m.id
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE mp.profile_id = $1
            ORDER BY m.start_time DESC
        `, [profile_id]);
};

const findMatchExistsById = async (match_id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.matches WHERE id = $1",
        [match_id]
    );
};

const findCharacterExistsById = async (character_id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.characters WHERE id = $1",
        [character_id]
    );
};

const findPlayerProfileExistsById = async (profile_id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.player_profile WHERE id = $1",
        [profile_id]
    );
};

const findExistingMatchPlayer = async (match_id, profile_id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.match_players WHERE match_id = $1 AND profile_id = $2",
        [match_id, profile_id]
    );
};

const createMatchPlayer = async ({ match_id, profile_id, character_id, team, is_winner, kills, deaths }) => {
    return pool.query(
        `
            INSERT INTO ducky_arena.match_players
            (match_id, profile_id, character_id, team, is_winner, kills, deaths)
            VALUES ($1, $2, $3, $4, COALESCE($5, false), COALESCE($6, 0), COALESCE($7, 0))
            RETURNING *
            `,
        [match_id, profile_id, character_id, team, is_winner, kills, deaths]
    );
};

const findMatchPlayerInfoById = async (id) => {
    return pool.query(`
            SELECT 
                mp.*,
                u.username as player_username,
                c.name as character_name,
                c.role as character_role
            FROM ducky_arena.match_players mp
            LEFT JOIN ducky_arena.player_profile p ON mp.profile_id = p.id
            LEFT JOIN ducky_arena.auth_user u ON p.user_id = u.id
            LEFT JOIN ducky_arena.characters c ON mp.character_id = c.id
            WHERE mp.id = $1
        `, [id]);
};

const findMatchPlayerExistsById = async (id) => {
    return pool.query(
        "SELECT id FROM ducky_arena.match_players WHERE id = $1",
        [id]
    );
};

const patchMatchPlayer = async (id, updates) => {
    const setClause = [];
    const values = [];
    let paramCount = 1;
    const allowedFields = ['team', 'is_winner', 'kills', 'deaths', 'character_id'];

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
            UPDATE ducky_arena.match_players 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
        values
    );
};

const deleteMatchPlayer = async (id) => {
    return pool.query(
        "DELETE FROM ducky_arena.match_players WHERE id = $1 RETURNING *",
        [id]
    );
};

module.exports = {
    findAllMatchPlayers,
    findMatchPlayerById,
    findMatchPlayersByMatchId,
    findMatchPlayersByTeam,
    findMatchWinners,
    findPlayerMatchStats,
    findMatchExistsById,
    findCharacterExistsById,
    findPlayerProfileExistsById,
    findExistingMatchPlayer,
    createMatchPlayer,
    findMatchPlayerInfoById,
    findMatchPlayerExistsById,
    patchMatchPlayer,
    deleteMatchPlayer
};
