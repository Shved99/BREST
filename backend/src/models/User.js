// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "manager", "customer"],
            default: "admin",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

module.exports = mongoose.model("User", userSchema);
