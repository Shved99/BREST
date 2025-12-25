import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",   // фронт и бэк на одном домене, nginx проксирует /api на Node
    timeout: 10000,
});

const ADMIN_TOKEN_KEY = "belarus_market_admin_token";

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
