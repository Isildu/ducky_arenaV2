/**
 * Model:
 * Centraliza las consultas SQL de la tabla auth_user.
 * No gestiona req/res ni decisiones HTTP.
 */
const pool = require("../config/db");

const findAllUsers = async () => {
    const result = await pool.query(
        "SELECT id, username, email, date_joined FROM ducky_arena.auth_user ORDER BY id ASC"
    );
    return result;
};

const findUserById = async (id) => {
    const result = await pool.query(
        "SELECT id, username, email, date_joined FROM ducky_arena.auth_user WHERE id = $1",
        [id]
    );
    return result;
};

const createUser = async ({ username, email, password }) => {
    const result = await pool.query(
        `
            INSERT INTO ducky_arena.auth_user
            (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, date_joined
            `,
        [username, email, password]
    );
    return result;
};

// Actualiza todos los campos editables del usuario.
const updateUser = async (id, { username, email, password }) => {
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
    return result;
};

const deleteUser = async (id) => {
    const result = await pool.query(
        "DELETE FROM ducky_arena.auth_user WHERE id = $1 RETURNING id, username, email, date_joined",
        [id]
    );
    return result;
};

module.exports = {
    findAllUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser
};
