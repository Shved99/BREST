// src/controllers/orderController.js
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ===== ПУБЛИЧНЫЙ СОЗДАНИЕ ЗАКАЗА =====
// POST /api/orders
async function createOrder(req, res) {
    try {
        const { items, customer, paymentMethod, comment } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "В заказе должен быть хотя бы один товар" });
        }

        if (!customer || !customer.fullName || !customer.phone || !customer.address) {
            return res.status(400).json({ message: "Заполните данные для доставки" });
        }

        // пересчёт суммы по базе (на всякий случай)
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const { product: productId, quantity } = item;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: "Некорректный ID товара" });
            }

            const product = await Product.findById(productId);
            if (!product || !product.isActive) {
                return res.status(400).json({ message: "Товар не найден или не активен" });
            }

            const qty = Number(quantity) || 1;
            const price = product.price;

            orderItems.push({
                product: product._id,
                quantity: qty,
                price,
            });

            totalAmount += price * qty;
        }

        const order = await Order.create({
            items: orderItems,
            totalAmount,
            customer,
            paymentMethod: paymentMethod || "cash_on_delivery",
            comment: comment || "",
        });

        res.status(201).json({
            orderId: order._id,
            status: order.status,
            totalAmount: order.totalAmount,
        });
    } catch (err) {
        console.error("Error in createOrder:", err);
        res.status(500).json({ message: "Ошибка сервера при создании заказа" });
    }
}

// ===== АДМИНСКИЕ =====

// GET /api/admin/orders
async function getAdminOrders(req, res) {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error("Error in getAdminOrders:", err);
        res.status(500).json({ message: "Ошибка сервера при получении заказов" });
    }
}

// GET /api/admin/orders/:id
async function getAdminOrderById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Некорректный ID заказа" });
        }

        const order = await Order.findById(id).populate("items.product");

        if (!order) {
            return res.status(404).json({ message: "Заказ не найден" });
        }

        res.json(order);
    } catch (err) {
        console.error("Error in getAdminOrderById:", err);
        res.status(500).json({ message: "Ошибка сервера при получении заказа" });
    }
}

// PUT /api/admin/orders/:id
async function updateAdminOrder(req, res) {
    try {
        const { id } = req.params;
        const { status, comment, customer } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Некорректный ID заказа" });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Заказ не найден" });
        }

        if (status) {
            order.status = status; // доверяем фронту одно из enum
        }

        if (comment !== undefined) {
            order.comment = comment;
        }

        // можно позволить подправить данные клиента
        if (customer) {
            if (customer.fullName !== undefined) order.customer.fullName = customer.fullName;
            if (customer.phone !== undefined) order.customer.phone = customer.phone;
            if (customer.address !== undefined) order.customer.address = customer.address;
        }

        await order.save();

        const populated = await order.populate("items.product");

        res.json(populated);
    } catch (err) {
        console.error("Error in updateAdminOrder:", err);
        res.status(500).json({ message: "Ошибка сервера при обновлении заказа" });
    }
}

module.exports = {
    // публичный
    createOrder,

    // админские
    getAdminOrders,
    getAdminOrderById,
    updateAdminOrder,
};
