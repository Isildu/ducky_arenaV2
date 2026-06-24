/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con usuarios.
 * Delega el acceso a datos al model.
 */
const AuthUserModel = require("../models/auth_user.model");

const getUsers = async (req, res) => {
    try {
        const result = await AuthUserModel.findAllUsers();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo usuarios: " + error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await AuthUserModel.findUserById(id);

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
        const result = await AuthUserModel.createUser({ username, email, password });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error creando usuario: " + error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const result = await AuthUserModel.updateUser(id, { username, email, password });

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
        const result = await AuthUserModel.deleteUser(id);

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
