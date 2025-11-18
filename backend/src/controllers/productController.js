// src/controllers/productController.js
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

// GET /api/products
// ?category=dairy|ObjectId&minPrice=&maxPrice=&manufacturer=&inStock=true&sort=price_asc&page=1&limit=12
async function getProducts(req, res) {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            manufacturer,
            inStock,
            sort,
            page = 1,
            limit = 12,
        } = req.query;

        const filter = { isActive: true };

        // Фильтр по категории (slug или ObjectId)
        if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                filter.category = category;
            } else {
                const catDoc = await Category.findOne({ slug: category.toString().toLowerCase() });
                if (catDoc) {
                    filter.category = catDoc._id;
                }
            }
        }

        // Фильтр по цене
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Фильтр по производителю
        if (manufacturer) {
            filter.manufacturer = manufacturer;
        }

        // Фильтр по наличию
        if (inStock === "true") {
            filter.inStock = true;
        }
        if (inStock === "false") {
            filter.inStock = false;
        }

        // Сортировка
        let sortOption = { createdAt: -1 }; // по умолчанию — новизна

        switch (sort) {
            case "price_asc":
                sortOption = { price: 1 };
                break;
            case "price_desc":
                sortOption = { price: -1 };
                break;
            case "new":
                sortOption = { createdAt: -1 };
                break;
            case "popular":
                // пока просто заглушка (нет поля популярности) — сортируем по createdAt
                sortOption = { createdAt: -1 };
                break;
            default:
                break;
        }

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 12;
        const skip = (pageNum - 1) * limitNum;

        const [items, total] = await Promise.all([
            Product.find(filter)
                .populate("category")
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(filter),
        ]);

        res.json({
            items,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (err) {
        console.error("Error in getProducts:", err);
        res.status(500).json({ message: "Ошибка сервера при получении товаров" });
    }
}

// GET /api/products/:id
async function getProductById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Некорректный ID товара" });
        }

        const product = await Product.findById(id).populate("category");

        if (!product || !product.isActive) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json(product);
    } catch (err) {
        console.error("Error in getProductById:", err);
        res.status(500).json({ message: "Ошибка сервера при получении товара" });
    }
}

module.exports = {
    getProducts,
    getProductById,
};
