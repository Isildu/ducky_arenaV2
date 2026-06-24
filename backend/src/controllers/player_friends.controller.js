const pool = require("../config/db");

// 1. GET /all - Obtener todas las relaciones de amistad del sistema
const getGlobalFriends = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.player_friends ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista global de amigos: " + error.message });
    }
};

// 2. GET /profile/:profile_id - Ver la lista de amigos de un jugador específico con nombres de personajes
const getFriendsByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await pool.query(
            `
            SELECT pf.id, pf.friend_id, pf.status, c.name AS favorite_character
            FROM ducky_arena.player_friends pf
            JOIN ducky_arena.characters c ON pf.character_id = c.id
            WHERE pf.profile_id = $1
            `,
            [profile_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los amigos del jugador: " + error.message });
    }
};

// GET /:id - Obtener una relacion de amistad por su PK.
const getFriendById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM ducky_arena.player_friends WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Relacion de amistad no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la relacion de amistad: " + error.message });
    }
};

// 3. POST / - Enviar una solicitud de amistad (Crea un registro en 'PENDING')
const addFriendRequest = async (req, res) => {
    const { character_id, profile_id, friend_id, status } = req.body;
    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.player_friends (character_id, profile_id, friend_id, status)
            VALUES ($1, $2, $3, COALESCE($4, 'PENDING'))
            RETURNING *
            `,
            [character_id, profile_id, friend_id, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al enviar la solicitud de amistad: " + error.message });
    }
};

// 4. PUT /:id - Cambiar el estado de la amistad (Ej: Aceptar 'ACCEPTED' o Bloquear 'BLOCKED')
const updateFriendStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Debería cumplir el dominio: 'PENDING', 'ACCEPTED', 'BLOCKED'
    try {
        const result = await pool.query(
            `
            UPDATE ducky_arena.player_friends
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de amistad no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado de amistad: " + error.message });
    }
};

// 5. DELETE /:id - Eliminar un amigo / Cancelar solicitud
const removeFriendship = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM ducky_arena.player_friends WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Relación de amistad no encontrada" });
        }

        res.status(200).json({ message: "Amistad o solicitud eliminada con éxito", deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la relación de amistad: " + error.message });
    }
};

module.exports = {
    getGlobalFriends,
    getFriendsByProfile,
    getFriendById,
    addFriendRequest,
    updateFriendStatus,
    removeFriendship
};
