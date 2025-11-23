// src/pages/admin/AdminCategoriesPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import Button from "../../components/common/Button.jsx";

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", slug: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosClient.get("/categories"); // публичный
            setCategories(res.data || []);
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить категории.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name) return;
        try {
            await axiosClient.post("/admin/categories", {
                name: form.name,
                slug: form.slug || undefined,
            });
            setForm({ name: "", slug: "" });
            loadCategories();
        } catch (e) {
            console.error(e);
            alert("Ошибка при создании категории.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить категорию?")) return;
        try {
            await axiosClient.delete(`/admin/categories/${id}`);
            setCategories((prev) => prev.filter((c) => c._id !== id));
        } catch (e) {
            console.error(e);
            alert("Ошибка при удалении категории (возможно, есть товары).");
        }
    };

    return (
        <div
            className="card"
            style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}
        >
            <h1 style={{ fontSize: 18, margin: 0 }}>Категории</h1>

            <form
                onSubmit={handleCreate}
                style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-end",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>Название</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Например, Молочная продукция"
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                            minWidth: 220,
                        }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>Slug (опционально)</label>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        placeholder="dairy, meat..."
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                            minWidth: 180,
                        }}
                    />
                </div>
                <Button type="submit">Добавить категорию</Button>
            </form>

            {loading && (
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Загрузка...
                </div>
            )}

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

            {!loading && categories.length > 0 && (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                    }}
                >
                    <thead>
                    <tr
                        style={{
                            textAlign: "left",
                            borderBottom: "1px solid var(--border-subtle)",
                        }}
                    >
                        <th style={{ padding: "8px 6px" }}>Название</th>
                        <th style={{ padding: "8px 6px" }}>Slug</th>
                        <th style={{ padding: "8px 6px" }}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((c) => (
                        <tr
                            key={c._id}
                            style={{ borderBottom: "1px solid var(--border-subtle)" }}
                        >
                            <td style={{ padding: "6px" }}>{c.name}</td>
                            <td style={{ padding: "6px" }}>{c.slug}</td>
                            <td style={{ padding: "6px" }}>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(c._id)}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "var(--primary)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {!loading && categories.length === 0 && (
                <div style={{ fontSize: 13 }}>Категорий пока нет.</div>
            )}
        </div>
    );
};

export default AdminCategoriesPage;
