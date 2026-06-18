require("dotenv").config();

const express = require("express");
const cors = require("cors");

const charactersRoutes = require("./routes/characters.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/characters", charactersRoutes);

// Ruta de prueba para verificar que el localhost funciona
app.get("/", (req, res) => {
    res.send("¡El servidor de DuckyShop está vivo y funcionando!");
});

app.use((req, res) => {
    res.status(404).json({ 
        message: "Ruta no encontrada",
        tip: "Prueba con /api/characters o /api/daily-quests"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});