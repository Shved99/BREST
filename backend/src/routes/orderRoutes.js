// src/routes/orderRoutes.js
const express = require("express");
const { createOrder } = require("../controllers/orderController");

const router = express.Router();

// Создание заказа (публично, без авторизации)
router.post("/orders", createOrder);

module.exports = router;
