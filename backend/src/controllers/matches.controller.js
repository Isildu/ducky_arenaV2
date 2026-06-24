// Asumiendo que tienes una configuración de base de datos en un archivo db.js
const pool = require("../config/db");

// 📋 READ - Obtener todas las partidas
const getMatches = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            ORDER BY m.id ASC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las partidas: " + error.message });
    }
};

// 📋 READ - Obtener una partida por ID
const getMatchById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la partida: " + error.message });
    }
};

// 📋 READ - Obtener partidas por modo de juego
const getMatchesByGameMode = async (req, res) => {
    const { game_mode } = req.query;
    try {
        if (!game_mode) {
            return res.status(400).json({ message: "Debes proporcionar un modo de juego en la query (?game_mode=...)" });
        }
        const result = await pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.game_mode = $1
            ORDER BY m.id ASC
        `, [game_mode]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por modo de juego: " + error.message });
    }
};

// 📋 READ - Obtener partidas por mapa
const getMatchesByMapId = async (req, res) => {
    const { map_id } = req.query;
    try {
        if (!map_id) {
            return res.status(400).json({ message: "Debes proporcionar un ID de mapa en la query (?map_id=...)" });
        }
        const result = await pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.map_id = $1
            ORDER BY m.id ASC
        `, [map_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por mapa: " + error.message });
    }
};

// 📋 READ - Obtener solo información básica (ID, mapa, modo, tiempo)
const getMatchBasicInfo = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT m.id, gm.name as map_name, m.game_mode, m.start_time, m.duration_seconds 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            ORDER BY m.id ASC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener información básica de partidas: " + error.message });
    }
};

// ✨ CREATE - Crear nueva partida
const createMatch = async (req, res) => {
    const { map_id, game_mode, start_time, duration_seconds } = req.body;

    try {
        // Verificar que el mapa existe
        const mapCheck = await pool.query(
            "SELECT id FROM ducky_arena.game_maps WHERE id = $1",
            [map_id]
        );

        if (mapCheck.rows.length === 0) {
            return res.status(400).json({ message: "El mapa especificado no existe" });
        }

        const result = await pool.query(
            `
            INSERT INTO ducky_arena.matches
            (map_id, game_mode, start_time, duration_seconds)
            VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP), $4)
            RETURNING *
            `,
            [map_id, game_mode, start_time, duration_seconds]
        );

        // Obtener información del mapa para la respuesta
        const matchWithMap = await pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.id = $1
        `, [result.rows[0].id]);

        res.status(201).json(matchWithMap.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando partida: " + error.message
        });
    }
};

// 🔄 UPDATE PARCIAL - Actualizar solo campos específicos (PATCH)
const patchMatch = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Verificar que la partida existe
        const matchCheck = await pool.query(
            "SELECT id FROM ducky_arena.matches WHERE id = $1",
            [id]
        );

        if (matchCheck.rows.length === 0) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }

        // Construir dinámicamente la consulta UPDATE
        const setClause = [];
        const values = [];
        let paramCount = 1;

        // Campos permitidos para actualizar
        const allowedFields = ['map_id', 'game_mode', 'start_time', 'duration_seconds'];
        
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

        // Verificar que el map_id existe si se está actualizando
        if (updates.map_id) {
            const mapCheck = await pool.query(
                "SELECT id FROM ducky_arena.game_maps WHERE id = $1",
                [updates.map_id]
            );
            if (mapCheck.rows.length === 0) {
                return res.status(400).json({ message: "El mapa especificado no existe" });
            }
        }

        values.push(id);

        const result = await pool.query(
            `
            UPDATE ducky_arena.matches 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
            values
        );

        // Obtener información completa con el mapa
        const matchWithMap = await pool.query(`
            SELECT m.*, gm.name as map_name, gm.environment_type 
            FROM ducky_arena.matches m
            LEFT JOIN ducky_arena.game_maps gm ON m.map_id = gm.id
            WHERE m.id = $1
        `, [id]);

        res.status(200).json({
            message: "Partida actualizada parcialmente",
            match: matchWithMap.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualización parcial: " + error.message });
    }
};

// 🗑️ DELETE - Eliminar partida
const deleteMatch = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.matches WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Partida no encontrada para eliminar" });
        }

        res.status(200).json({
            message: "Partida eliminada exitosamente",
            match: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando partida: " + error.message });
    }
};

// Exportamos todas las funciones
module.exports = {
    getMatches,
    getMatchById,
    getMatchesByGameMode,
    getMatchesByMapId,
    getMatchBasicInfo,
    createMatch,
    patchMatch,
    deleteMatch
};
