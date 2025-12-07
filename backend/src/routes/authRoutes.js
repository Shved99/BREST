// src/routes/authRoutes.js
const express = require("express");
const { loginAdmin, logoutAdmin} = require("../controllers/authController");

const router = express.Router();

// Вход админа, возвращает JWT
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", logoutAdmin);

module.exports = router;
