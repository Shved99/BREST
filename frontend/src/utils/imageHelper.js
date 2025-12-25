// src/utils/imageHelper.js

export function normalizeImageUrl(value) {
    if (!value) return null;

    const url = String(value).trim();

    // 1. Полный внешний URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // 2. Уже абсолютный путь от корня домена
    if (url.startsWith("/")) {
        return url;
    }

    // 3. Только имя файла или относительный путь — кладём в /uploads
    // Заодно уберём возможный префикс "uploads/" в начале
    const cleaned = url.replace(/^uploads\//, "");
    return `/uploads/${cleaned}`;
}
