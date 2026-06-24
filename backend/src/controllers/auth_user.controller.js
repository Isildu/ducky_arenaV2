const pool = require("../config/db");

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email, date_joined FROM ducky_arena.auth_user ORDER BY id ASC"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo usuarios: " + error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT id, username, email, date_joined FROM ducky_arena.auth_user WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo usuario: " + error.message });
    }
};

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.auth_user
            (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, date_joined
            `,
            [username, email, password]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creando usuario: " + error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE ducky_arena.auth_user
            SET username = $1,
                email = $2,
                password = $3
            WHERE id = $4
            RETURNING id, username, email, date_joined
            `,
            [username, email, password, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando usuario: " + error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.auth_user WHERE id = $1 RETURNING id, username, email, date_joined",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario eliminado correctamente",
            user: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Error eliminando usuario: " + error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
