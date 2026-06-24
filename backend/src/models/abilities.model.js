/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllAbilities = async () => {
    const result = await pool.query("SELECT * FROM ducky_arena.abilities ORDER BY id ASC");
    return result;
};

const findAbilityById = async (id) => {
    const result = await pool.query("SELECT * FROM ducky_arena.abilities WHERE id = $1", [id]);
    return result;
};

const createAbility = async ({ character_id, input_key, name, cooldown }) => {
    const result = await pool.query(
        `
            INSERT INTO ducky_arena.abilities
            (character_id, input_key, name, cooldown)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
        [character_id, input_key, name, cooldown]
    );

    return result;
};

const updateAbility = async (id, { character_id, input_key, name, cooldown }) => {
    const result = await pool.query(
        `
            UPDATE ducky_arena.abilities
            SET character_id = $1,
                input_key = $2,
                name = $3,
                cooldown = $4
            WHERE id = $5
            RETURNING *
            `,
        [character_id, input_key, name, cooldown, id]
    );

    return result;
};

const deleteAbility = async (id) => {
    const result = await pool.query(
        "DELETE FROM ducky_arena.abilities WHERE id = $1 RETURNING *",
        [id]
    );

    return result;
};

module.exports = {
    findAllAbilities,
    findAbilityById,
    createAbility,
    updateAbility,
    deleteAbility
};
