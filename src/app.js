require("dotenv").config();

const express = require("express");
const cors = require("cors");

const charactersRoutes = require("./routes/characters.routes");
const dailyQuestRoutes = require("./routes/daily_quest.routes");
const dailyGameMaps = require("./routes/game_maps.routes");
const matchesRoutes = require("./routes/matches.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/characters", charactersRoutes);
app.use("/api/daily-quest", dailyQuestRoutes);
app.use("/api/game-maps", dailyGameMaps);
app.use("/api/matches", matchesRoutes);
// Ruta de prueba para verificar que el localhost funciona
app.get("/", (req, res) => {
    res.send("¡El servidor de DuckyShop está vivo y funcionando!");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});