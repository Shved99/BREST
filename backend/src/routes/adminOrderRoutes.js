// src/routes/adminOrderRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
    getAdminOrders,
    getAdminOrderById,
    updateAdminOrder,
} = require("../controllers/orderController");

const router = express.Router();

// все маршруты — только для админа
router.use(auth, adminOnly);

// GET /api/admin/orders
router.get("/orders", getAdminOrders);

// GET /api/admin/orders/:id
router.get("/orders/:id", getAdminOrderById);

// PUT /api/admin/orders/:id
router.put("/orders/:id", updateAdminOrder);

module.exports = router;
