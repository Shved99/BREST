// src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient, { ADMIN_TOKEN_KEY } from "../api/axiosClient.js";
import Button from "../components/common/Button.jsx";
import Container from "../components/common/Container.jsx";

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setError("");
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            setError("Введите email и пароль.");
            return;
        }

        try{
        setLoading(true);
        const res = await axiosClient.post("/admin/login", {
            email: form.email,
            password: form.password,
        });

        const token = res.data.token;
        if (!token) {
            throw new Error("Токен не получен");
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        navigate("/admin/products");
    } catch (e) {
        console.error(e);
        setError("Неверный email или пароль, либо ошибка сервера.");
    } finally {
        setLoading(false);
    }
};

return (
    <div
        style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--bg-body)",
        }}
    >
        <Container>
            <div
                className="card"
                style={{
                    maxWidth: 420,
                    margin: "0 auto",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: 0.08,
                        }}
                    >
                        Административная панель
                    </div>
                    <h1 style={{ fontSize: 20, margin: "4px 0 0" }}>
                        Вход в админку
                    </h1>
                </div>

                {error && (
                    <div
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontSize: 13,
                        }}
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="admin@belarus-market.local"
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Пароль</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="admin123"
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Входим..." : "Войти"}
                    </Button>
                </form>

                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Доступ только для администратора магазина.
                </div>
            </div>
        </Container>
    </div>
);
};

export default AdminLoginPage;
