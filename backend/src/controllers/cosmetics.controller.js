const pool = require("../config/db");

const getCosmetics = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.cosmetics ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo cosméticos: " + error.message });
    }
};

const getCosmeticById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM ducky_arena.cosmetics WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cosmético no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo cosmético: " + error.message });
    }
};

const createCosmetic = async (req, res) => {
    const { name, type, price, img_url } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.cosmetics
            (name, type, price, img_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [name, type, price, img_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creando cosmético: " + error.message });
    }
};

const updateCosmetic = async (req, res) => {
    const { id } = req.params;
    const { name, type, price, img_url } = req.body;

    try {
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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cosmético no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando cosmético: " + error.message });
    }
};

const deleteCosmetic = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.cosmetics WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cosmético no encontrado" });
        }

        res.status(200).json({
            message: "Cosmético eliminado correctamente",
            cosmetic: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Error eliminando cosmético: " + error.message });
    }
};

module.exports = {
    getCosmetics,
    getCosmeticById,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic
};
