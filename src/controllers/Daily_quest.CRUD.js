// Asumiendo que tienes una configuración de base de datos en un archivo db.js
const pool = require("../db");

// 📋 READ - Obtener todos los quests diarios
const getDailyQuests = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM DuckiesArena.daily_quest ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los quests diarios: " + error.message });
    }
};

// 📋 READ - Obtener un quest diario por ID
const getDailyQuestsById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM DuckiesArena.daily_quest WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el quest diario: " + error.message });
    }
};

// 📋 READ - Obtener quests diarios por recompensa
const getReward = async (req, res) => {
    const { reward_coins } = req.query;
    try {
        if (!reward_coins) {
            return res.status(400).json({ message: "Debes proporcionar un tipo de recompensa en la query (?reward_coins=...)" });
        }
        const result = await pool.query("SELECT * FROM DuckiesArena.daily_quest WHERE reward_coins = $1", [reward_coins]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por recompensa: " + error.message });
    }
};

// 📋 READ - Obtener solo descripcion
const getDescription = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, description FROM DuckiesArena.daily_quest ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las descripciones: " + error.message });
    }
};

// ✨ CREATE - Crear nuevo quest diario
const createDailyQuest = async (req, res) => {
    const { description, reward_coins } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO DuckiesArena.daily_quest
            (description, reward_coins)
            VALUES ($1,$2)
            RETURNING *
            `,
            [description, reward_coins]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando quest diario: " + error.message
        });
    }
};

// 🔄 UPDATE - Actualizar quest diario existente (COMPLETO)
/*const updateDailyQuest = async (req, res) => {
    const { id } = req.params;
    const { description, reward_coins } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE DuckiesArena.daily_quest 
            SET 
                description = COALESCE($1, description),
                reward_coins = COALESCE($2, reward_coins),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
            `,
            [description, reward_coins, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Quest diario actualizado exitosamente",
            dailyQuest: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error actualizando quest diario: " + error.message });
    }
};*/

            
// 🔄 UPDATE PARCIAL - Actualizar solo campos específicos (PATCH)
const patchDailyQuest = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Construir dinámicamente la consulta UPDATE
        const setClause = [];
        const values = [];
        let paramCount = 1;

        // Campos permitidos para actualizar
        const allowedFields = ['description', 'reward_coins'];
        
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

        // Agregar updated_at y el ID
        setClause.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await pool.query(
            `
            UPDATE DuckiesArena.daily_quest
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
            `,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado" });
        }

        res.status(200).json({
            message: "Quest diario actualizado parcialmente",
            dailyQuest: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error en actualización parcial: " + error.message });
    }
};

// 🗑️ DELETE - Eliminar personaje (COMPLETO)
const deleteDailyQuest = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM DuckiesArena.daily_quest WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quest diario no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Quest diario eliminado exitosamente",
            dailyQuest: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error eliminando quest diario: " + error.message });
    }
};


// Exportamos todas las funciones
module.exports = {
    getDailyQuests,
    getDailyQuestsById,
    getReward,
    getDescription,
    createDailyQuest,
    //updateDailyQuest,
    patchDailyQuest,
    deleteDailyQuest
};