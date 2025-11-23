// src/pages/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ADMIN_TOKEN_KEY } from "../../api/axiosClient.js";
import Button from "../../components/common/Button.jsx";

const AdminLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        navigate("/admin/login");
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
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Админка</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    Беларусь Маркет
                </div>
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
