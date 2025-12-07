// src/pages/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ADMIN_TOKEN_KEY } from "../../api/axiosClient.js";
import axiosClient from "../../api/axiosClient.js";

const AdminLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axiosClient.post("/admin/logout");
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            navigate("/"); // после выхода – на главную страницу витрины
        }
    };

    const handleGoToSite = () => {
        // просто перейти на публичную главную, не трогая токен
        navigate("/");
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex" }}>
            <aside
                style={{
                    width: 220,
                    backgroundColor: "#111827",
                    color: "#e5e7eb",
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Админка</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
                    Беларусь Маркет
                </div>

                {/* Кнопка перехода на главную витрины */}
                <button
                    type="button"
                    onClick={handleGoToSite}
                    style={{
                        width: "100%",
                        borderRadius: 999,
                        border: "1px solid #4b5563",
                        padding: "6px 10px",
                        background: "#f9fafb",
                        color: "#111827",
                        fontSize: 13,
                        cursor: "pointer",
                        marginBottom: 8,
                    }}
                >
                    ← На главную
                </button>

                <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <NavLink
                        to="/admin/products"
                        style={({ isActive }) => ({
                            padding: "6px 10px",
                            borderRadius: 8,
                            backgroundColor: isActive ? "#1f2937" : "transparent",
                            color: "#e5e7eb",
                            fontSize: 14,
                        })}
                    >
                        Товары
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        style={({ isActive }) => ({
                            padding: "6px 10px",
                            borderRadius: 8,
                            backgroundColor: isActive ? "#1f2937" : "transparent",
                            color: "#e5e7eb",
                            fontSize: 14,
                        })}
                    >
                        Категории
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        style={({ isActive }) => ({
                            padding: "6px 10px",
                            borderRadius: 8,
                            backgroundColor: isActive ? "#1f2937" : "transparent",
                            color: "#e5e7eb",
                            fontSize: 14,
                        })}
                    >
                        Заказы
                    </NavLink>
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            borderRadius: 999,
                            border: "1px solid #4b5563",
                            padding: "6px 10px",
                            background: "transparent",
                            color: "#e5e7eb",
                            fontSize: 13,
                            cursor: "pointer",
                        }}
                    >
                        Выйти
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: 24, backgroundColor: "#f3f4f6" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
