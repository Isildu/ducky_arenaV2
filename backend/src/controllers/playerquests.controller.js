const pool = require("../config/db");

// 1. GET /all - Obtener el historial global de misiones asignadas a todos los jugadores
const getPlayerQuests = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.player_quests ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las misiones globales: " + error.message });
    }
};

// 2. GET /profile/:profile_id - Obtener el diario de misiones de un jugador específico (Con los textos de la misión)
const getQuestsByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await pool.query(
            `
            SELECT pq.id, pq.profile_id, pq.quest_id, pq.is_completed, dq.description, dq.reward_coins
            FROM ducky_arena.player_quests pq
            JOIN ducky_arena.daily_quest dq ON pq.quest_id = dq.id
            WHERE pq.profile_id = $1
            `,
            [profile_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las misiones del jugador: " + error.message });
    }
};

// 3. POST / - Asignar una nueva misión diaria a un jugador
// GET /:id - Obtener una mision asignada por su PK.
const getPlayerQuestById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM ducky_arena.player_quests WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de mision no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la mision del jugador: " + error.message });
    }
};

const assignQuest = async (req, res) => {
    const { profile_id, quest_id, is_completed } = req.body;
    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.player_quests (profile_id, quest_id, is_completed)
            VALUES ($1, $2, COALESCE($3, FALSE))
            RETURNING *
            `,
            [profile_id, quest_id, is_completed]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al asignar la misión: " + error.message });
    }
};

// 4. PUT /:id - Actualizar el estado de la misión (Completarla y cambiar is_completed a TRUE)
const updateQuestStatus = async (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body;
    try {
        const result = await pool.query(
            `
            UPDATE ducky_arena.player_quests
            SET is_completed = $1
            WHERE id = $2
            RETURNING *
            `,
            [is_completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de misión no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado de la misión: " + error.message });
    }
};

// 5. DELETE /:id - Eliminar/Quitar una misión asignada a un jugador
const removeQuestFromPlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM ducky_arena.player_quests WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de misión no encontrado para eliminar" });
        }

        res.status(200).json({ message: "Misión retirada correctamente del jugador", deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la misión: " + error.message });
    }
};

module.exports = {
    getPlayerQuests,
    getQuestsByProfile,
    getPlayerQuestById,
    assignQuest,
    updateQuestStatus,
    removeQuestFromPlayer
};
