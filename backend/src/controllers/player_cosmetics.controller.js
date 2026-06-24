const pool = require("../config/db");

// 1. GET /all - Obtener todo el inventario global de cosméticos asignados de los jugadores
const getPlayerCosmetics = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.player_cosmetics ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los cosméticos de los jugadores: " + error.message });
    }
};

// 2. GET /profile/:profile_id - Obtener TODOS los cosméticos de un jugador específico (¡Súper útil para el inventario!)
const getCosmeticsByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await pool.query(
            `
            SELECT pc.id, pc.profile_id, pc.cosmetic_id, pc.is_unlocked, c.name, c.type, c.img_url
            FROM ducky_arena.player_cosmetics pc
            JOIN ducky_arena.cosmetics c ON pc.cosmetic_id = c.id
            WHERE pc.profile_id = $1
            `,
            [profile_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el inventario del jugador: " + error.message });
    }
};

// 3. POST / - Asignar/Desbloquear un cosmético a un jugador (Compra en tienda o recompensa)
// GET /:id - Obtener una asignacion de cosmetico por su PK.
const getPlayerCosmeticById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM ducky_arena.player_cosmetics WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de cosmetico no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el cosmetico del jugador: " + error.message });
    }
};

const unlockCosmetic = async (req, res) => {
    const { profile_id, cosmetic_id, is_unlocked } = req.body;
    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.player_cosmetics (profile_id, cosmetic_id, is_unlocked)
            VALUES ($1, $2, COALESCE($3, FALSE))
            RETURNING *
            `,
            [profile_id, cosmetic_id, is_unlocked]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al asignar el cosmético: " + error.message });
    }
};

// 4. PUT /:id - Modificar el estado de un cosmético (Por ejemplo, cambiar is_unlocked a TRUE al pagar)
const updateCosmeticStatus = async (req, res) => {
    const { id } = req.params;
    const { is_unlocked } = req.body;
    try {
        const result = await pool.query(
            `
            UPDATE ducky_arena.player_cosmetics
            SET is_unlocked = $1
            WHERE id = $2
            RETURNING *
            `,
            [is_unlocked, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de cosmético no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el cosmético: " + error.message });
    }
};

// 5. DELETE /:id - Eliminar la asignación de un cosmético (Quitar del inventario)
const removeCosmeticFromPlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM ducky_arena.player_cosmetics WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado para eliminar" });
        }

        res.status(200).json({ message: "Cosmético retirado del inventario del jugador", deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al retirar el cosmético: " + error.message });
    }
};

module.exports = {
    getPlayerCosmetics,
    getCosmeticsByProfile,
    getPlayerCosmeticById,
    unlockCosmetic,
    updateCosmeticStatus,
    removeCosmeticFromPlayer
};
