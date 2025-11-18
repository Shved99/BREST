// src/middleware/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Нет токена авторизации" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        return res.status(401).json({ message: "Невалидный или истёкший токен" });
    }
}

module.exports = auth;
