// src/utils/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function main() {
    try {
        await connectDB();

        const email = "admin@belarus-market.local";
        const password = "admin123"; // можешь поменять

        const existing = await User.findOne({ email });
        if (existing) {
            console.log("Админ уже существует:", existing.email);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            role: "admin",
            isActive: true,
        });

        console.log("✅ Админ создан:");
        console.log("Email:", email);
        console.log("Пароль:", password);
        console.log("ID:", user._id.toString());

        process.exit(0);
    } catch (err) {
        console.error("Ошибка при создании админа:", err);
        process.exit(1);
    }
}

main();
