// src/server.js
require("dotenv").config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const adminCategoryRoutes = require("./routes/adminCategoryRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminUploadRoutes = require("./routes/adminUploadRoutes");

const app = express();

// Подключаемся к MongoDB
connectDB();

// Базовые middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// Тестовый маршрут для проверки здоровья сервера
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Belarus Market backend is running",
    });
});

// Публичные маршруты
app.use("/api", authRoutes);      // /api/admin/login
app.use("/api", categoryRoutes);  // /api/categories
app.use("/api", productRoutes);   // /api/products, /api/products/:id
app.use("/api", orderRoutes);     // /api/orders

// Админские маршруты (защищены auth + adminOnly внутри)
app.use("/api/admin", adminCategoryRoutes); // /api/admin/categories
app.use("/api/admin", adminProductRoutes);  // /api/admin/products
app.use("/api/admin", adminOrderRoutes);    // /api/admin/orders
app.use("/api/admin", adminUploadRoutes);   // /api/admin/upload

// 404 — после всех маршрутов
app.use(notFound);

// Общий обработчик ошибок — последним
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// на будущее, если захочешь тесты
module.exports = app;
