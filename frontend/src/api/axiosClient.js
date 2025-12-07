// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://brest.chernikovave1993.fvds.ru/api" || "http://localhost:5000/api",
    timeout: 10000,
});

// ключ, под которым храним токен админа
const ADMIN_TOKEN_KEY = "belarus_market_admin_token";

// подмешиваем токен в каждый запрос, если он есть
axiosClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export { ADMIN_TOKEN_KEY };
export default axiosClient;
