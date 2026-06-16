// Asumiendo que tienes una configuración de base de datos en un archivo db.js
const pool = require("../db");

// 1. GET /all - Obtener todos los personajes
const getCharacters = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM characters ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los personajes: " + error.message });
    }
};

// 2. GET /:id - Obtener un personaje por su ID (Reemplaza a tu antiguo 'getId')
const getCharactersById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM characters WHERE id = $1", [id]);
        
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
        const result = await pool.query("SELECT * FROM characters WHERE role = $1", [type]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por rol: " + error.message });
    }
};

// 4. GET / - Obtener solo los nombres de los personajes (Para tu ruta 'getName')
const getName = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name FROM characters ORDER BY name ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los nombres: " + error.message });
    }
};

// Exportamos exactamente lo que tu archivo de rutas necesita
module.exports = {
    getCharacters,
    getCharactersById,
    getRole,
    getName
};