// src/controllers/categoryController.js
const Category = require("../models/Category");

// Публичный список категорий
async function getCategories(req, res) {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error("Error in getCategories:", err);
        res.status(500).json({ message: "Ошибка сервера при получении категорий" });
    }
}

// ====== АДМИНСКИЕ ФУНКЦИИ ======

function makeSlug(name) {
    return name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"); // простая генерация slug
}

// POST /api/admin/categories
async function createCategory(req, res) {
    try {
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Название категории обязательно" });
        }

        const finalSlug = slug ? slug.toString().toLowerCase() : makeSlug(name);

        const existing = await Category.findOne({ slug: finalSlug });
        if (existing) {
            return res.status(400).json({ message: "Категория с таким slug уже существует" });
        }

        const category = await Category.create({
            name,
            slug: finalSlug,
        });

        res.status(201).json(category);
    } catch (err) {
        console.error("Error in createCategory:", err);
        res.status(500).json({ message: "Ошибка сервера при создании категории" });
    }
}

// PUT /api/admin/categories/:id
async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        if (name) category.name = name;
        if (slug) category.slug = slug.toString().toLowerCase();

        await category.save();

        res.json(category);
    } catch (err) {
        console.error("Error in updateCategory:", err);
        res.status(500).json({ message: "Ошибка сервера при обновлении категории" });
    }
}

// DELETE /api/admin/categories/:id
async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        await category.deleteOne();

        res.json({ message: "Категория удалена" });
    } catch (err) {
        console.error("Error in deleteCategory:", err);
        res.status(500).json({ message: "Ошибка сервера при удалении категории" });
    }
}

module.exports = {
    getCategories,

    // админские
    createCategory,
    updateCategory,
    deleteCategory,
};
