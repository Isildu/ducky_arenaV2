require("dotenv").config();

const express = require("express");
const cors = require("cors");

const charactersRoutes = require("./routes/characters.routes");
const dailyQuestRoutes = require("./routes/daily_quest.routes");
const dailyGameMaps = require("./routes/game_maps.routes");
const matchesRoutes = require("./routes/matches.routes");
const matchPlayerRoutes = require("./routes/matchPlayers.routes");
const abilitiesRoutes = require("./routes/abilities.routes");
const cosmeticsRoutes = require("./routes/cosmetics.routes");
const usersRoutes = require("./routes/users.routes");

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

app.get("/", (req, res) => {
    res.send("¡El servidor de Ducky Arena está vivo y funcionando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});