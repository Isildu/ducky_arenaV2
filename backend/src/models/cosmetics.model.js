/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllCosmetics = async () => {
    const result = await pool.query("SELECT * FROM ducky_arena.cosmetics ORDER BY id ASC");
    return result;
};

const findCosmeticById = async (id) => {
    const result = await pool.query("SELECT * FROM ducky_arena.cosmetics WHERE id = $1", [id]);
    return result;
};

const createCosmetic = async ({ name, type, price, img_url }) => {
    const result = await pool.query(
        `
            INSERT INTO ducky_arena.cosmetics
            (name, type, price, img_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
        [name, type, price, img_url]
    );

    return result;
};

const updateCosmetic = async (id, { name, type, price, img_url }) => {
    const result = await pool.query(
        `
            UPDATE ducky_arena.cosmetics
            SET name = $1,
                type = $2,
                price = $3,
                img_url = $4
            WHERE id = $5
            RETURNING *
            `,
        [name, type, price, img_url, id]
    );

    return result;
};

const deleteCosmetic = async (id) => {
    const result = await pool.query(
        "DELETE FROM ducky_arena.cosmetics WHERE id = $1 RETURNING *",
        [id]
    );

    return result;
};

module.exports = {
    findAllCosmetics,
    findCosmeticById,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic
};
