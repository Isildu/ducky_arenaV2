// Asumiendo que tienes una configuración de base de datos en un archivo db.js
const pool = require("../config/db");

// 📋 READ - Obtener todos los jugadores de todas las partidas
const getMatchPlayers = async (req, res) => {
    try {
        const result = await pool.query(`
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
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los jugadores de partidas: " + error.message });
    }
};

// 📋 READ - Obtener un registro de match_player por ID
const getMatchPlayerById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de jugador en partida no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el registro: " + error.message });
    }
};

// 📋 READ - Obtener jugadores por partida
const getMatchPlayersByMatchId = async (req, res) => {
    const { match_id } = req.query;

    try {
        if (!match_id) {
            return res.status(400).json({
                message: "Debes proporcionar un ID de partida en la query (?match_id=...)"
            });
        }

        const result = await pool.query(`
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

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: "Error al filtrar jugadores por partida: " + error.message
        });
    }
};

// 📋 READ - Obtener jugadores por equipo en una partida
const getMatchPlayersByTeam = async (req, res) => {
    const { match_id, team } = req.query;
    try {
        if (!match_id || !team) {
            return res.status(400).json({
                message: "Debes proporcionar match_id y team en la query (?match_id=...&team=...)"
            });
        }
        const result = await pool.query(`
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
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por equipo: " + error.message });
    }
};

// 📋 READ - Obtener ganadores de una partida
const getMatchWinners = async (req, res) => {
    const { match_id } = req.query;
    try {
        if (!match_id) {
            return res.status(400).json({ message: "Debes proporcionar un ID de partida en la query (?match_id=...)" });
        }
        const result = await pool.query(`
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
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener ganadores: " + error.message });
    }
};

// 📋 READ - Obtener estadísticas de un jugador en todas sus partidas
const getPlayerMatchStats = async (req, res) => {
    const { profile_id } = req.query;
    try {
        if (!profile_id) {
            return res.status(400).json({ message: "Debes proporcionar un profile_id en la query (?profile_id=...)" });
        }
        const result = await pool.query(`
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

        // Calcular estadísticas agregadas
        const stats = {
            total_matches: result.rows.length,
            total_kills: result.rows.reduce((sum, row) => sum + row.kills, 0),
            total_deaths: result.rows.reduce((sum, row) => sum + row.deaths, 0),
            wins: result.rows.filter(row => row.is_winner).length,
            matches: result.rows
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener estadísticas del jugador: " + error.message });
    }
};

// ✨ CREATE - Agregar jugador a una partida
const createMatchPlayer = async (req, res) => {
    const { match_id, profile_id, character_id, team, is_winner, kills, deaths } = req.body;

    try {
        // Verificar que la partida existe
        const matchCheck = await pool.query(
            "SELECT id FROM ducky_arena.matches WHERE id = $1",
            [match_id]
        );
        if (matchCheck.rows.length === 0) {
            return res.status(400).json({ message: "La partida especificada no existe" });
        }

        // Verificar que el personaje existe
        const characterCheck = await pool.query(
            "SELECT id FROM ducky_arena.characters WHERE id = $1",
            [character_id]
        );
        if (characterCheck.rows.length === 0) {
            return res.status(400).json({ message: "El personaje especificado no existe" });
        }

        // Verificar que el perfil existe
        const profileCheck = await pool.query(
            "SELECT id FROM ducky_arena.player_profile WHERE id = $1",
            [profile_id]
        );
        if (profileCheck.rows.length === 0) {
            return res.status(400).json({ message: "El perfil de jugador especificado no existe" });
        }

        // Verificar que el jugador no esté ya en la partida
        const existingCheck = await pool.query(
            "SELECT id FROM ducky_arena.match_players WHERE match_id = $1 AND profile_id = $2",
            [match_id, profile_id]
        );
        if (existingCheck.rows.length > 0) {
            return res.status(400).json({
                message: "Este jugador ya está registrado en esta partida"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO ducky_arena.match_players
            (match_id, profile_id, character_id, team, is_winner, kills, deaths)
            VALUES ($1, $2, $3, $4, COALESCE($5, false), COALESCE($6, 0), COALESCE($7, 0))
            RETURNING *
            `,
            [match_id, profile_id, character_id, team, is_winner, kills, deaths]
        );

        // Obtener información completa para la respuesta
        const matchPlayerWithInfo = await pool.query(`
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
        `, [result.rows[0].id]);

        res.status(201).json(matchPlayerWithInfo.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error agregando jugador a la partida: " + error.message
        });
    }
};

// 🔄 UPDATE PARCIAL - Actualizar estadísticas del jugador en partida
const patchMatchPlayer = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Verificar que el registro existe
        const check = await pool.query(
            "SELECT id FROM ducky_arena.match_players WHERE id = $1",
            [id]
        );
        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        // Construir dinámicamente la consulta UPDATE
        const setClause = [];
        const values = [];
        let paramCount = 1;

        // Campos permitidos para actualizar
        const allowedFields = ['team', 'is_winner', 'kills', 'deaths', 'character_id'];

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                setClause.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (setClause.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron campos válidos para actualizar" });
        }

        // Si se actualiza character_id, verificar que existe
        if (updates.character_id) {
            const characterCheck = await pool.query(
                "SELECT id FROM ducky_arena.characters WHERE id = $1",
                [updates.character_id]
            );
            if (characterCheck.rows.length === 0) {
                return res.status(400).json({ message: "El personaje especificado no existe" });
            }
        }

        values.push(id);

        const result = await pool.query(
            `
            UPDATE ducky_arena.match_players 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
            values
        );

        // Obtener información completa
        const matchPlayerWithInfo = await pool.query(`
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

        res.status(200).json({
            message: "Estadísticas de jugador actualizadas parcialmente",
            matchPlayer: matchPlayerWithInfo.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualización parcial: " + error.message });
    }
};

// 🗑️ DELETE - Eliminar jugador de partida
const deleteMatchPlayer = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.match_players WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Jugador eliminado de la partida exitosamente",
            matchPlayer: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando jugador de la partida: " + error.message });
    }
};

// Exportamos todas las funciones
module.exports = {
    getMatchPlayers,
    getMatchPlayerById,
    getMatchPlayersByMatchId,
    getMatchPlayersByTeam,
    getMatchWinners,
    getPlayerMatchStats,
    createMatchPlayer,
    patchMatchPlayer,
    deleteMatchPlayer
};
