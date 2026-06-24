const pool = require("../config/db");

const getAbilities = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.abilities ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo habilidades: " + error.message });
    }
};

const getAbilityById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM ducky_arena.abilities WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habilidad no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo habilidad: " + error.message });
    }
};

const createAbility = async (req, res) => {
    const { character_id, input_key, name, cooldown } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.abilities
            (character_id, input_key, name, cooldown)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [character_id, input_key, name, cooldown]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creando habilidad: " + error.message });
    }
};

const updateAbility = async (req, res) => {
    const { id } = req.params;
    const { character_id, input_key, name, cooldown } = req.body;

    try {
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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habilidad no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando habilidad: " + error.message });
    }
};

const deleteAbility = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.abilities WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habilidad no encontrada" });
        }

        res.status(200).json({
            message: "Habilidad eliminada correctamente",
            ability: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Error eliminando habilidad: " + error.message });
    }
};

module.exports = {
    getAbilities,
    getAbilityById,
    createAbility,
    updateAbility,
    deleteAbility
};
