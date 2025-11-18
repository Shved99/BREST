// src/controllers/categoryController.js
const Category = require("../models/Category");

// GET /api/categories
async function getCategories(req, res) {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.json(categories);
    } catch (err) {
        console.error("Error in getCategories:", err);
        res.status(500).json({ message: "Ошибка сервера при получении категорий" });
    }
}

module.exports = {
    getCategories,
};
