// src/routes/adminUploadRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Папка для картинок товаров
const uploadDir = path.join(__dirname, "..", "..", "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path
            .basename(file.originalname, ext)
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        cb(null, `${base}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Можно загружать только изображения"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // до 5МБ
});

// POST /api/admin/upload
router.post(
    "/upload",
    auth,
    adminOnly,
    upload.single("image"),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "Файл не получен" });
        }

        // URL, который будем хранить в Product.images
        const url = `/uploads/products/${req.file.filename}`;

        res.status(201).json({
            url,
        });
    }
);

module.exports = router;
