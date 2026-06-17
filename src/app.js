require("dotenv").config();

const express = require("express");
const cors = require("cors");

const charactersRoutes = require("./routes/characters.routes");
const playerRoutes = require("./routes/players.routes");
const cosmeticRoutes = require("./routes/cosmetics.routes");
const questRoutes = require("./routes/quests.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/characters", charactersRoutes);
app.use("/profiles", playerRoutes);
app.use("/player-cosmetics", cosmeticRoutes);
app.use("/player-quests", questRoutes);

// Ruta de prueba para verificar que el localhost funciona
app.get("/", (req, res) => {
    res.send("¡El servidor de DuckyShop está vivo y funcionando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});