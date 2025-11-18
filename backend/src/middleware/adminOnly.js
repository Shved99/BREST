// src/middleware/adminOnly.js
function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён: только для админа" });
    }
    next();
}

module.exports = adminOnly;
