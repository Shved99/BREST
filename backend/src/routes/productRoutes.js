// src/routes/productRoutes.js
const express = require("express");
const {
    getProducts,
    getProductById,
} = require("../controllers/productController");

const router = express.Router();

// Публичный список товаров с фильтрами и пагинацией
router.get("/products", getProducts);

// Детальная карточка товара
router.get("/products/:id", getProductById);

module.exports = router;
