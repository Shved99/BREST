// src/server.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Подключаемся к MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Тестовый маршрут
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Belarus Market backend is running",
    });
});

// Публичные маршруты
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
