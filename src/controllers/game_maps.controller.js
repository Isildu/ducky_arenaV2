// Asumiendo que tienes una configuración de base de datos en un archivo db.js
const pool = require("../db");

// 📋 READ - Obtener todos los mapas del juego
const getGameMaps = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.game_maps ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los mapas del juego: " + error.message });
    }
};

// 📋 READ - Obtener un mapa del juego por ID
const getGameMapById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.game_maps WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el mapa del juego: " + error.message });
    }
};

// 📋 READ - Obtener mapas del juego por tipo
const getGameMapsByEnvironmentType = async (req, res) => {
    const { environment_type } = req.query;
    try {
        if (!environment_type) {
            return res.status(400).json({ message: "Debes proporcionar un tipo de entorno en la query (?environment_type=...)" });
        }
        const result = await pool.query("SELECT * FROM ducky_arena.game_maps WHERE environment_type = $1", [environment_type]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por tipo: " + error.message });
    }
};

// 📋 READ - Obtener solo nombre
const getGameMapNames = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name FROM ducky_arena.game_maps ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los nombres de los mapas: " + error.message });
    }
};

// ✨ CREATE - Crear nuevo mapa del juego
const createGameMap = async (req, res) => {
    const { name, environment_type } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.game_maps
            (name, environment_type)
            VALUES ($1,$2)
            RETURNING *
            `,
            [name, environment_type]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando mapa del juego: " + error.message
        });
    }
};

// 🔄 UPDATE - Actualizar mapa del juego existente (COMPLETO)
/*const updateGameMap = async (req, res) => {
    const { id } = req.params;
    const { name, environment_type } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE ducky_arena.game_maps 
            SET 
                name = COALESCE($1, name),
                environment_type = COALESCE($2, environment_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
            `,
            [name, environment_type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Mapa del juego actualizado exitosamente",
            gameMap: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error actualizando mapa del juego: " + error.message });
    }
};*/

            
// 🔄 UPDATE PARCIAL - Actualizar solo campos específicos (PATCH)
const patchGameMap = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Construir dinámicamente la consulta UPDATE
        const setClause = [];
        const values = [];
        let paramCount = 1;

        // Campos permitidos para actualizar
        const allowedFields = ['name', 'environment_type'];
        
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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado" });
        }

        res.status(200).json({
            message: "Mapa del juego actualizado parcialmente",
            gameMap: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualización parcial: " + error.message });
    }
};

// 🗑️ DELETE - Eliminar personaje (COMPLETO)
const deleteGameMap = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.game_maps WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mapa del juego no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Mapa del juego eliminado exitosamente",
            gameMap: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando mapa del juego: " + error.message });
    }
};


// Exportamos todas las funciones
module.exports = {
    getGameMaps,
    getGameMapById,
    getGameMapsByEnvironmentType,
    getGameMapNames,
    createGameMap,
    //updateGameMap,
    patchGameMap,
    deleteGameMap
};
