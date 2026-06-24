/**
 * Controller:
 * Gestiona peticiones HTTP relacionadas con amistades de jugadores.
 * Delega el acceso a datos al model.
 */
const PlayerFriendsModel = require("../models/player_friends.model");

const getGlobalFriends = async (req, res) => {
    try {
        const result = await PlayerFriendsModel.findAllPlayerFriends();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista global de amigos: " + error.message });
    }
};

const getFriendsByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const result = await PlayerFriendsModel.findFriendsByProfile(profile_id);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los amigos del jugador: " + error.message });
    }
};

const getFriendById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerFriendsModel.findFriendById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Relacion de amistad no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la relacion de amistad: " + error.message });
    }
};

const addFriendRequest = async (req, res) => {
    const { character_id, profile_id, friend_id, status } = req.body;
    try {
        const result = await PlayerFriendsModel.createFriendRequest({ character_id, profile_id, friend_id, status });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al enviar la solicitud de amistad: " + error.message });
    }
};

const updateFriendStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await PlayerFriendsModel.updateFriendStatus(id, status);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registro de amistad no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado de amistad: " + error.message });
    }
};

const removeFriendship = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PlayerFriendsModel.deleteFriendship(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "RelaciÃ³n de amistad no encontrada" });
        }

        res.status(200).json({ message: "Amistad o solicitud eliminada con Ã©xito", deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la relaciÃ³n de amistad: " + error.message });
    }
};

module.exports = {
    getGlobalFriends,
    getFriendsByProfile,
    getFriendById,
    addFriendRequest,
    updateFriendStatus,
    removeFriendship
};
