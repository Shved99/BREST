// src/routes/categoryRoutes.js
const express = require("express");
const { getCategories } = require("../controllers/categoryController");

const router = express.Router();

// Публичный список категорий
router.get("/categories", getCategories);

module.exports = router;
