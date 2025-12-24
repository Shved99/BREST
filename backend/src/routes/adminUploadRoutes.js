// src/routes/adminUploadRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const slugify = require("slugify");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// ВАЖНО: папка от корня проекта (рядом с package.json), а не от src/routes
const uploadDir = path.join(process.cwd(), "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const baseRaw = path.basename(file.originalname, ext);

        // FIX: часто originalname приходит как latin1 → превращаем в utf8
        const baseUtf8 = Buffer.from(baseRaw, "latin1")
            .toString("utf8")
            .normalize("NFC");

        // Безопасное имя (ASCII), чтобы не было ð... и %C3%B0...
        const safeBase =
            slugify(baseUtf8, { lower: true, strict: true, trim: true }) || "image";

        cb(null, `${safeBase}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Можно загружать только изображения"));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/admin/upload
router.post("/upload", auth, adminOnly, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Файл не получен" });
    }

    // В БД храним только относительный путь
    const url = `/uploads/products/${req.file.filename}`;

    return res.status(201).json({ url });
});

module.exports = router;
