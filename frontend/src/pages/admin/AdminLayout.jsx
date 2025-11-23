import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div style={{ minHeight: "100vh", display: "flex" }}>
            <aside
                style={{
                    width: 220,
                    backgroundColor: "#111827",
                    color: "#e5e7eb",
                    padding: 16,
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 24 }}>Админка</div>
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
            </aside>
            <main style={{ flex: 1, padding: 24, backgroundColor: "#f3f4f6" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
