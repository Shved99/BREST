// src/routes/adminProductRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// все маршруты ниже — только для админа
router.use(auth, adminOnly);

// GET /api/admin/products
router.get("/products", getAdminProducts);

// POST /api/admin/products
router.post("/products", createProduct);

// PUT /api/admin/products/:id
router.put("/products/:id", updateProduct);

// DELETE /api/admin/products/:id
router.delete("/products/:id", deleteProduct);

module.exports = router;
