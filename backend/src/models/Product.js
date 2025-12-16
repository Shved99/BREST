// src/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        manufacturer: {
            type: String,
            default: "Беларусь",
            trim: true,
        },
        weight: {
            type: String,
            default: "",
            trim: true,
        },
        volume: {
            type: String,
            default: "",
            trim: true,
        },
        images: [
            {
                type: String, // URL картинки
                trim: true,
            },
        ],
        inStock: {
            type: Boolean,
            default: true,
        },
        stockCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false, // можно использовать для "акций/новинок" на главной
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
