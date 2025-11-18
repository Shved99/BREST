// src/middleware/errorHandler.js

// 404 — не найдено
function notFound(req, res, next) {
    res.status(404).json({ message: "Not found" });
}

// Общий обработчик ошибок
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error("Error handler:", err);

    const status = err.statusCode || 500;

    res.status(status).json({
        message: err.message || "Внутренняя ошибка сервера",
        // в дипломной можно показать стек в dev-режиме
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}

module.exports = {
    notFound,
    errorHandler,
};
