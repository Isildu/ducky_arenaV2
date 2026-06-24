require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Rutas base del juego
const charactersRoutes = require("./routes/characters.routes");
const dailyQuestRoutes = require("./routes/daily_quest.routes");
const dailyGameMaps = require("./routes/game_maps.routes");
const matchesRoutes = require("./routes/matches.routes");
const matchPlayerRoutes = require("./routes/match_players.routes");
const abilitiesRoutes = require("./routes/abilities.routes");
const cosmeticsRoutes = require("./routes/cosmetics.routes");
const usersRoutes = require("./routes/auth_user.routes");

// Mis rutas (Inventario, progreso y relaciones del jugador)
const playerRoutes = require("./routes/player_profile.routes");
const playerCosmeticRoutes = require("./routes/player_cosmetics.routes"); // Renombrado para evitar confusión
const questRoutes = require("./routes/player_quests.routes");
const friendRoutes = require("./routes/player_friends.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Middlewares de rutas base
app.use("/api/characters", charactersRoutes);
app.use("/api/daily-quest", dailyQuestRoutes);
app.use("/api/game-maps", dailyGameMaps);
app.use("/api/matches", matchesRoutes);
app.use("/api/match-players", matchPlayerRoutes);
app.use("/api/abilities", abilitiesRoutes);
app.use("/api/cosmetics", cosmeticsRoutes);
app.use("/api/users", usersRoutes);

// Middlewares de mis rutas del jugador
app.use("/api/profiles", playerRoutes);
app.use("/api/player-cosmetics", playerCosmeticRoutes); // Actualizado aquí
app.use("/api/player-quests", questRoutes);
app.use("/api/player-friends", friendRoutes);

// Ruta de prueba para verificar que el localhost funciona
app.get("/", (req, res) => {
    res.send("¡El servidor de Ducky Arena está vivo y funcionando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
