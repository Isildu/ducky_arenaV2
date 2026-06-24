require("dotenv").config();

const express = require("express");
const cors = require("cors");

const charactersRoutes = require("./routes/characters.routes");
const dailyQuestRoutes = require("./routes/daily_quest.routes");
const dailyGameMaps = require("./routes/game_maps.routes");
const matchesRoutes = require("./routes/matches.routes");
const matchPlayerRoutes = require("./routes/match_players.routes");
const abilitiesRoutes = require("./routes/abilities.routes");
const cosmeticsRoutes = require("./routes/cosmetics.routes");
const usersRoutes = require("./routes/auth_user.routes");
const playerRoutes = require("./routes/player_profile.routes");
const playerCosmeticRoutes = require("./routes/player_cosmetics.routes");
const questRoutes = require("./routes/player_quests.routes");
const friendRoutes = require("./routes/player_friends.routes");
const rankingRoutes = require("./routes/ranking.routes");
const notFound = require("./middleware/not_found.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/characters", charactersRoutes);
app.use("/api/daily-quest", dailyQuestRoutes);
app.use("/api/game-maps", dailyGameMaps);
app.use("/api/matches", matchesRoutes);
app.use("/api/match-players", matchPlayerRoutes);
app.use("/api/abilities", abilitiesRoutes);
app.use("/api/cosmetics", cosmeticsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/profiles", playerRoutes);
app.use("/api/player-cosmetics", playerCosmeticRoutes);
app.use("/api/player-quests", questRoutes);
app.use("/api/player-friends", friendRoutes);
app.use("/api/ranking", rankingRoutes);

app.get("/", (req, res) => {
    res.send("Â¡El servidor de Ducky Arena estÃ¡ vivo y funcionando!");
});

app.use(notFound);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
