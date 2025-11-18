// src/routes/adminCategoryRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// все маршруты ниже — только для админа
router.use(auth, adminOnly);

// POST /api/admin/categories
router.post("/categories", createCategory);

// PUT /api/admin/categories/:id
router.put("/categories/:id", updateCategory);

// DELETE /api/admin/categories/:id
router.delete("/categories/:id", deleteCategory);

module.exports = router;
