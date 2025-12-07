// src/pages/admin/AdminProductsPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import Button from "../../components/common/Button.jsx";

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // форма создания / редактирования товара
    const [form, setForm] = useState({
        title: "",
        categoryId: "",
        price: "",
        manufacturer: "",
        weight: "",
        volume: "",
        imageUrl: "",
        inStock: true,
    });

    // id редактируемого товара (null = создаём новый)
    const [editingId, setEditingId] = useState(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosClient.get("/admin/products");
            setProducts(res.data || []);
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить товары.");
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await axiosClient.get("/categories");
            setCategories(res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить товар?")) return;
        try {
            await axiosClient.delete(`/admin/products/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));

            if (editingId === id) {
                resetForm();
            }
        } catch (e) {
            console.error(e);
            alert("Ошибка при удалении товара.");
        }
    };

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({
            title: "",
            categoryId: "",
            price: "",
            manufacturer: "",
            weight: "",
            volume: "",
            imageUrl: "",
            inStock: true,
        });
        setEditingId(null);
    };

    // создание / редактирование
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.categoryId || !form.price) {
            alert("Заполните название, категорию и цену.");
            return;
        }

        const payload = {
            title: form.title,
            category: form.categoryId,
            price: Number(form.price),
            manufacturer: form.manufacturer || undefined,
            weight: form.weight || undefined,
            volume: form.volume || undefined,
            inStock: form.inStock,
            images: form.imageUrl ? [form.imageUrl] : [],
        };

        try {
            if (editingId) {
                // обновление товара
                await axiosClient.put(`/admin/products/${editingId}`, payload);
            } else {
                // создание нового товара
                await axiosClient.post("/admin/products", payload);
            }

            resetForm();
            loadProducts();
        } catch (e) {
            console.error(e);
            alert(
                editingId
                    ? "Не удалось обновить товар."
                    : "Не удалось создать товар."
            );
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);

        setForm({
            title: product.title || "",
            // category может быть либо объектом, либо id
            categoryId: product.category?._id || product.category || "",
            price: product.price != null ? String(product.price) : "",
            manufacturer: product.manufacturer || "",
            weight: product.weight || "",
            volume: product.volume || "",
            imageUrl:
                Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : "",
            inStock: Boolean(product.inStock),
        });
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    return (
        <div
            className="card"
            style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                }}
            >
                <h1 style={{ fontSize: 18, margin: 0 }}>Товары</h1>
                <Button variant="outline" onClick={loadProducts}>
                    Обновить список
                </Button>
            </div>

            {/* Форма создания / редактирования товара */}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 12,
                    alignItems: "flex-end",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.7fr 1.3fr",
                        gap: 8,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Название</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleFormChange("title", e.target.value)}
                            placeholder="Например, Сыр «Брест-Литовск»"
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Категория</label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => handleFormChange("categoryId", e.target.value)}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Цена, ₽</label>
                        <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(e) => handleFormChange("price", e.target.value)}
                            placeholder="650"
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                        }}
                    >
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Производитель</label>
                        <input
                            type="text"
                            value={form.manufacturer}
                            onChange={(e) =>
                                handleFormChange("manufacturer", e.target.value)
                            }
                            placeholder="Коммунарка / Белита..."
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 8,
                        alignItems: "flex-end",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Вес</label>
                        <input
                            type="text"
                            value={form.weight}
                            onChange={(e) => handleFormChange("weight", e.target.value)}
                            placeholder="200 г"
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Объём</label>
                        <input
                            type="text"
                            value={form.volume}
                            onChange={(e) => handleFormChange("volume", e.target.value)}
                            placeholder="500 мл"
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>URL изображения</label>
                        <input
                            type="text"
                            value={form.imageUrl}
                            onChange={(e) => handleFormChange("imageUrl", e.target.value)}
                            placeholder="https://..."
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                    }}
                >
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={form.inStock}
                            onChange={(e) =>
                                handleFormChange("inStock", e.target.checked)
                            }
                        />
                        В наличии
                    </label>

                    <Button type="submit">
                        {editingId ? "Сохранить изменения" : "Добавить товар"}
                    </Button>

                    {editingId && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                        >
                            Отменить
                        </Button>
                    )}
                </div>
            </form>

            {/* Ошибка/загрузка */}
            {loading && (
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Загрузка списка товаров...
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
                        marginBottom: 10,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Таблица товаров */}
            {!loading && products.length === 0 && (
                <div style={{ fontSize: 13 }}>Товаров пока нет.</div>
            )}

            {!loading && products.length > 0 && (
                <div
                    style={{
                        width: "100%",
                        overflowX: "auto",
                    }}
                >
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
                            <th style={{ padding: "8px 6px" }}>Категория</th>
                            <th style={{ padding: "8px 6px" }}>Цена</th>
                            <th style={{ padding: "8px 6px" }}>Наличие</th>
                            <th style={{ padding: "8px 6px" }}>Активен</th>
                            <th style={{ padding: "8px 6px" }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((p) => (
                            <tr
                                key={p._id}
                                style={{
                                    borderBottom: "1px solid var(--border-subtle)",
                                    backgroundColor:
                                        editingId === p._id
                                            ? "rgba(148, 163, 184, 0.08)"
                                            : "transparent",
                                }}
                            >
                                <td style={{ padding: "6px" }}>{p.title}</td>
                                <td style={{ padding: "6px" }}>
                                    {p.category?.name || "—"}
                                </td>
                                <td style={{ padding: "6px" }}>{p.price} ₽</td>
                                <td style={{ padding: "6px" }}>
                                    {p.inStock ? "В наличии" : "Нет"}
                                </td>
                                <td style={{ padding: "6px" }}>
                                    {p.isActive ? "Да" : "Нет"}
                                </td>
                                <td style={{ padding: "6px", display: "flex", gap: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(p)}
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#2563eb",
                                            cursor: "pointer",
                                            fontSize: 12,
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(p._id)}
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "var(--primary)",
                                            cursor: "pointer",
                                            fontSize: 12,
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
