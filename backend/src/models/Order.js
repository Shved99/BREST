// src/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false, // не создаём отдельный _id для вложенных элементов
    }
);

const orderSchema = new mongoose.Schema(
    {
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length > 0,
                message: "В заказе должен быть хотя бы один товар",
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        customer: {
            fullName: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
            address: {
                type: String,
                required: true,
                trim: true,
            },
        },
        status: {
            type: String,
            enum: ["new", "processing", "shipped", "delivered"],
            default: "new",
        },
        paymentMethod: {
            type: String,
            enum: ["online", "cash_on_delivery"],
            default: "cash_on_delivery",
        },
        comment: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
