const pool = require("../db");

// 1. GET /all - Obtener todos los perfiles de jugadores
const getPlayerProfiles = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.player_profile ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los perfiles: " + error.message });
    }
};

// 2. GET /:id - Obtener un perfil por su ID
const getPlayerProfileById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.player_profile WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Perfil de jugador no encontrado" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil: " + error.message });
    }
};

// 3. POST / - Crear un nuevo perfil de jugador
// Nota: Requiere un user_id existente en auth_user debido a la FK
const createPlayerProfile = async (req, res) => {
    const { user_id, level, experience, bread_coins } = req.body;
    try {
        // Usamos DEFAULT si no se pasan parámetros, para heredar los valores del SQL
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.player_profile (user_id, level, experience, bread_coins)
            VALUES ($1, COALESCE($2, 1), COALESCE($3, 0), COALESCE($4, 0))
            RETURNING *
            `,
            [user_id, level, experience, bread_coins]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el perfil: " + error.message });
    }
};

// 4. PUT /:id - Actualizar datos del perfil (nivel, experiencia, monedas)
const updatePlayerProfile = async (req, res) => {
    const { id } = req.params;
    const { level, experience, bread_coins } = req.body;
    try {
        const result = await pool.query(
            `
            UPDATE ducky_arena.player_profile
            SET level = $1, experience = $2, bread_coins = $3
            WHERE id = $4
            RETURNING *
            `,
            [level, experience, bread_coins, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Perfil no encontrado para actualizar" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el perfil: " + error.message });
    }
};

// 5. DELETE /:id - Eliminar un perfil
const deletePlayerProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM ducky_arena.player_profile WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Perfil no encontrado para eliminar" });
        }

        res.status(200).json({ message: "Perfil de jugador eliminado correctamente", profile: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el perfil: " + error.message });
    }
};

module.exports = {
    getPlayerProfiles,
    getPlayerProfileById,
    createPlayerProfile,
    updatePlayerProfile,
    deletePlayerProfile
};