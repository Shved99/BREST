// src/config/db.js
const mongoose = require("mongoose");

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        await mongoose.connect(uri);

        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // выходим, если БД не подключилась
    }
}

module.exports = connectDB;
