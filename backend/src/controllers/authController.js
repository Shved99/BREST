const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/admin/login
async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Укажите email и пароль" });
        }

        const user = await User.findOne({ email });

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        const payload = {
            id: user._id,
            role: user.role,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error in loginAdmin:", err);
        return res.status(500).json({ message: "Ошибка сервера при входе" });
    }
}

// POST /api/admin/logout
// Для JWT без сессий logout по сути «формальный» — токен забываем на клиенте.
// Но эндпоинт оставляем, чтобы фронт мог вызывать единообразно.
async function logoutAdmin(req, res) {
    try {
        // Если позже добавишь refresh-токены/сессии — чистить их здесь.
        return res.status(200).json({ message: "Вы вышли из админ-панели" });
    } catch (err) {
        console.error("Error in logoutAdmin:", err);
        return res.status(500).json({ message: "Ошибка сервера при выходе" });
    }
}

module.exports = {
    loginAdmin,
    logoutAdmin,
};
