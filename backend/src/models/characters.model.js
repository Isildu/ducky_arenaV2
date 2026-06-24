/**
 * Model
 *
 * Centraliza consultas SQL.
 * No contiene logica HTTP.
 */
const pool = require("../config/db");

const findAllCharacters = async () => {
    const result = await pool.query("SELECT * FROM ducky_arena.characters ORDER BY id ASC");
    return result;
};

const findCharacterById = async (id) => {
    const result = await pool.query("SELECT * FROM ducky_arena.characters WHERE id = $1", [id]);
    return result;
};

const findCharactersByRole = async (type) => {
    const result = await pool.query("SELECT * FROM ducky_arena.characters WHERE role = $1", [type]);
    return result;
};

const findCharacterNames = async () => {
    const result = await pool.query("SELECT id, name FROM ducky_arena.characters ORDER BY name ASC");
    return result;
};

const createCharacter = async ({ name, role, base_health, attack_damage, endurance }) => {
    const result = await pool.query(
        `
            INSERT INTO ducky_arena.characters
            (name, role, base_health, attack_damage, endurance)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
            `,
        [name, role, base_health, attack_damage, endurance]
    );

    return result;
};

const updateCharacter = async (id, { name, role, base_health, attack_damage, endurance }) => {
    const result = await pool.query(
        `
            UPDATE ducky_arena.characters
            SET name = $1,
                role = $2,
                base_health = $3,
                attack_damage = $4,
                endurance = $5
            WHERE id = $6
            RETURNING *
            `,
        [name, role, base_health, attack_damage, endurance, id]
    );

    return result;
};

const deleteCharacter = async (id) => {
    const result = await pool.query(
        "DELETE FROM ducky_arena.characters WHERE id = $1 RETURNING *",
        [id]
    );

    return result;
};

module.exports = {
    findAllCharacters,
    findCharacterById,
    findCharactersByRole,
    findCharacterNames,
    createCharacter,
    updateCharacter,
    deleteCharacter
};
