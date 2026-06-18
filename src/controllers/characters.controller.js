// Asumiendo que tienes una configuración de base de datos en un archivo db.js
const pool = require("../db");

// 1. GET /all - Obtener todos los personajes
const getCharacters = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.characters ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los personajes: " + error.message });
    }
};

// 2. GET /:id - Obtener un personaje por su ID (Reemplaza a tu antiguo 'getId')
const getCharactersById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM ducky_arena.characters WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }
        
        res.status(200).json(result.rows[0]); // Devuelve el personaje con todos sus atributos (vida, ataque, etc.)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el personaje: " + error.message });
    }
};

// 3. GET /role - Obtener personajes filtrados por rol (Reemplaza a 'getRole')
// Ejemplo de uso: /characters/role?type=WARRIOR (o el ENUM que uses en character_role)
const getRole = async (req, res) => {
    const { type } = req.query; 
    try {
        if (!type) {
            return res.status(400).json({ message: "Debes proporcionar un tipo de rol en la query (?type=...)" });
        }
        const result = await pool.query("SELECT * FROM ducky_arena.characters WHERE role = $1", [type]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por rol: " + error.message });
    }
};

// 4. GET / - Obtener solo los nombres de los personajes (Para tu ruta 'getName')
const getName = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name FROM ducky_arena.characters ORDER BY name ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los nombres: " + error.message });
    }
};

const createCharacter = async (req, res) => {
    const { name, role, base_health, attack_damage, endurance } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO ducky_arena.characters
            (name, role, base_health, attack_damage, endurance)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [name, role, base_health, attack_damage, endurance]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "Error creando personaje: " + error.message
        });
    }
};

const updateCharacter = async (req, res) => {
    const { id } = req.params;
    const { name, role, base_health, attack_damage, endurance } = req.body;

    try {
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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: "Error actualizando personaje: " + error.message
        });
    }
};

const deleteCharacter = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM ducky_arena.characters WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personaje no encontrado" });
        }

        res.status(200).json({
            message: "Personaje eliminado correctamente",
            character: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            error: "Error eliminando personaje: " + error.message
        });
    }
};

// Exportamos exactamente lo que tu archivo de rutas necesita
module.exports = {
    getCharacters,
    getCharactersById,
    getRole,
    getName,
    createCharacter,
    updateCharacter,
    deleteCharacter
};