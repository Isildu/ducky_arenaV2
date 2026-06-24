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

const findPlayerDashboardProfile = async (id) => {
    return pool.query(
        `
            SELECT pp.*, au.username, au.email
            FROM ducky_arena.player_profile pp
            JOIN ducky_arena.auth_user au ON pp.user_id = au.id
            WHERE pp.id = $1
            `,
        [id]
    );
};

const findRecentMatchesByProfile = async (id) => {
    return pool.query(
        `
            SELECT
                m.id,
                gm.name AS map_name,
                m.game_mode,
                m.start_time,
                m.duration_seconds,
                mp.team,
                mp.is_winner,
                mp.kills,
                mp.deaths,
                c.name AS character_name
            FROM ducky_arena.match_players mp
            JOIN ducky_arena.matches m ON mp.match_id = m.id
            JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            JOIN ducky_arena.characters c ON mp.character_id = c.id
            WHERE mp.profile_id = $1
            ORDER BY m.start_time DESC
            LIMIT 5
            `,
        [id]
    );
};

const findActiveQuestsByProfile = async (id) => {
    return pool.query(
        `
            SELECT pq.id, pq.profile_id, pq.quest_id, pq.is_completed, dq.description, dq.reward_coins
            FROM ducky_arena.player_quests pq
            JOIN ducky_arena.daily_quest dq ON pq.quest_id = dq.id
            WHERE pq.profile_id = $1 AND pq.is_completed = FALSE
            ORDER BY pq.id ASC
            `,
        [id]
    );
};

const findUnlockedCosmeticsByProfile = async (id) => {
    return pool.query(
        `
            SELECT pc.id, pc.profile_id, pc.cosmetic_id, pc.is_unlocked, c.name, c.type, c.price, c.img_url
            FROM ducky_arena.player_cosmetics pc
            JOIN ducky_arena.cosmetics c ON pc.cosmetic_id = c.id
            WHERE pc.profile_id = $1 AND pc.is_unlocked = TRUE
            ORDER BY pc.id ASC
            `,
        [id]
    );
};

const findPlayerStats = async (id) => {
    return pool.query(
        `
            SELECT
                COALESCE(SUM(CASE WHEN is_winner THEN 1 ELSE 0 END), 0)::int AS wins,
                COALESCE(SUM(CASE WHEN is_winner THEN 0 ELSE 1 END), 0)::int AS losses,
                COALESCE(SUM(kills), 0)::int AS total_kills,
                COALESCE(SUM(deaths), 0)::int AS total_deaths,
                COALESCE(
                    ROUND(
                        SUM(CASE WHEN is_winner THEN 1 ELSE 0 END)::numeric
                        / NULLIF(COUNT(*), 0) * 100,
                        2
                    ),
                    0
                ) AS win_rate
            FROM ducky_arena.match_players
            WHERE profile_id = $1
            `,
        [id]
    );
};

const findInventoryCosmeticsByProfile = async (id) => {
    return pool.query(
        `
            SELECT pc.id, pc.profile_id, pc.cosmetic_id, pc.is_unlocked, c.name, c.type, c.price, c.img_url
            FROM ducky_arena.player_cosmetics pc
            JOIN ducky_arena.cosmetics c ON pc.cosmetic_id = c.id
            WHERE pc.profile_id = $1
            ORDER BY pc.id ASC
            `,
        [id]
    );
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
    findPlayerDashboardProfile,
    findRecentMatchesByProfile,
    findActiveQuestsByProfile,
    findUnlockedCosmeticsByProfile,
    findPlayerStats,
    findInventoryCosmeticsByProfile,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
};
