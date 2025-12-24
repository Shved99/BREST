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
async function getAdminProducts(req, res) {
    try {
        const products = await Product.find()
            .populate("category")
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        console.error("Error in getAdminProducts:", err);
        res.status(500).json({ message: "Ошибка сервера при получении товаров" });
    }
}

// POST /api/admin/products
async function createProduct(req, res) {
    try {
        const {
            title,
            category, // ожидаем ObjectId категории
            description,
            price,
            manufacturer,
            weight,
            volume,
            images,
            inStock,
            stockCount,
            isFeatured,
            isActive,
        } = req.body;

        if (!title || !category || price == null) {
            return res
                .status(400)
                .json({ message: "Обязательные поля: title, category, price" });
        }

        // есть ли такая категория
        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(400).json({ message: "Категория не найдена" });
        }

        // Генерация slug из title
        const slug = title
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");

        // Проверка уникальности slug
        let uniqueSlug = slug;
        let counter = 1;
        while (await Product.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const product = await Product.create({
            title,
            slug: uniqueSlug,
            category,
            description,
            price,
            manufacturer,
            weight,
            volume,
            images,
            inStock,
            stockCount,
            isFeatured,
            isActive,
        });

        const populated = await product.populate("category");

        res.status(201).json(populated);
    } catch (err) {
        console.error("Error in createProduct:", err);
        res.status(500).json({ message: "Ошибка сервера при создании товара" });
    }
}

// PUT /api/admin/products/:id
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            title,
            category,
            description,
            price,
            manufacturer,
            weight,
            volume,
            images,
            inStock,
            stockCount,
            isFeatured,
            isActive,
        } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        if (title !== undefined) product.title = title;
        if (category !== undefined) product.category = category;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (manufacturer !== undefined) product.manufacturer = manufacturer;
        if (weight !== undefined) product.weight = weight;
        if (volume !== undefined) product.volume = volume;
        if (images !== undefined) product.images = images;
        if (inStock !== undefined) product.inStock = inStock;
        if (stockCount !== undefined) product.stockCount = stockCount;
        if (isFeatured !== undefined) product.isFeatured = isFeatured;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();

        const populated = await product.populate("category");

        res.json(populated);
    } catch (err) {
        console.error("Error in updateProduct:", err);
        res.status(500).json({ message: "Ошибка сервера при обновлении товара" });
    }
}

// DELETE /api/admin/products/:id
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        await product.deleteOne();

        res.json({ message: "Товар удалён" });
    } catch (err) {
        console.error("Error in deleteProduct:", err);
        res.status(500).json({ message: "Ошибка сервера при удалении товара" });
    }
}

module.exports = {
    getProducts,
    getProductById,
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
