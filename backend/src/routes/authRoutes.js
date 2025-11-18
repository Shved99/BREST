// src/routes/authRoutes.js
const express = require("express");
const { loginAdmin } = require("../controllers/authController");

const router = express.Router();

// Вход админа, возвращает JWT
router.post("/admin/login", loginAdmin);

module.exports = router;
