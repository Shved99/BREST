// src/pages/admin/AdminProductsPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import Button from "../../components/common/Button.jsx";
import { normalizeImageUrl } from "../../utils/imageHelper.js";

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        categoryId: "",
        price: "",
        manufacturer: "",
        weight: "",
        volume: "",
        imageUrl: "",
        inStock: true,
        isActive: true,
    });

    const [editingId, setEditingId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

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
            if (editingId === id) resetForm();
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
            isActive: true,
        });
        setEditingId(null);
    };

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
            inStock: Boolean(form.inStock),
            isActive: Boolean(form.isActive),
            images: form.imageUrl ? [form.imageUrl] : [],
        };

        try {
            if (editingId) {
                await axiosClient.put(`/admin/products/${editingId}`, payload);
            } else {
                await axiosClient.post("/admin/products", payload);
            }

            resetForm();
            loadProducts();
        } catch (e) {
            console.error(e);
            alert(editingId ? "Не удалось обновить товар." : "Не удалось создать товар.");
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);

        setForm({
            title: product.title || "",
            categoryId: product.category?._id || product.category || "",
            price: product.price != null ? String(product.price) : "",
            manufacturer: product.manufacturer || "",
            weight: product.weight || "",
            volume: product.volume || "",
            imageUrl:
                Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "",
            inStock: Boolean(product.inStock),
            isActive: product.isActive == null ? true : Boolean(product.isActive),
        });
    };

    const handleCancelEdit = () => resetForm();

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("image", file);

            const res = await axiosClient.post("/admin/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
            alert("Изображение загружено успешно!");
        } catch (e) {
            console.error(e);
            alert("Ошибка при загрузке изображения.");
        } finally {
            setUploadingImage(false);
        }
    };

    // общие inline-стили (mobile-first)
    const fieldWrap = { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 };
    const labelStyle = { fontSize: 13, fontWeight: 500 };
    const inputBase = {
        width: "100%",
        minWidth: 0, // ✅ критично против горизонтального скролла в grid/flex
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid var(--border-subtle)",
        fontSize: 13,
        boxSizing: "border-box",
    };

    return (
        <div
            className="card"
            style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: "100%",
                overflowX: "hidden", // ✅ страховка от горизонтального скролла
            }}
        >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h1 style={{ fontSize: 18, margin: 0 }}>Товары</h1>
                <Button variant="outline" onClick={loadProducts}>
                    Обновить список
                </Button>
            </div>

            {/* Форма (mobile-first: 1 колонка, без фиксированных gridTemplateColumns) */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, minWidth: 0 }}>
                    <div style={fieldWrap}>
                        <label style={labelStyle}>Название</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleFormChange("title", e.target.value)}
                            placeholder="Например, Сыр «Брест-Литовск»"
                            style={inputBase}
                        />
                    </div>

                    <div style={fieldWrap}>
                        <label style={labelStyle}>Категория</label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => handleFormChange("categoryId", e.target.value)}
                            style={inputBase}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 0 }}>
                        <div style={fieldWrap}>
                            <label style={labelStyle}>Цена, ₽</label>
                            <input
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={(e) => handleFormChange("price", e.target.value)}
                                placeholder="650"
                                style={inputBase}
                            />
                        </div>

                        <div style={fieldWrap}>
                            <label style={labelStyle}>Производитель</label>
                            <input
                                type="text"
                                value={form.manufacturer}
                                onChange={(e) => handleFormChange("manufacturer", e.target.value)}
                                placeholder="Коммунарка / Белита..."
                                style={inputBase}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 0 }}>
                        <div style={fieldWrap}>
                            <label style={labelStyle}>Вес</label>
                            <input
                                type="text"
                                value={form.weight}
                                onChange={(e) => handleFormChange("weight", e.target.value)}
                                placeholder="200 г"
                                style={inputBase}
                            />
                        </div>

                        <div style={fieldWrap}>
                            <label style={labelStyle}>Объём</label>
                            <input
                                type="text"
                                value={form.volume}
                                onChange={(e) => handleFormChange("volume", e.target.value)}
                                placeholder="500 мл"
                                style={inputBase}
                            />
                        </div>
                    </div>

                    <div style={fieldWrap}>
                        <label style={labelStyle}>Изображение</label>

                        {/* ✅ делаем file input в колонку, чтобы не раздувал ширину */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                style={{ fontSize: 13, width: "100%", minWidth: 0 }}
                            />

                            {uploadingImage && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Загрузка...</span>}
                        </div>

                        {form.imageUrl && (
                            <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                                <img
                                    src={normalizeImageUrl(form.imageUrl)}
                                    alt="Preview"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        flex: "0 0 auto",
                                        objectFit: "cover",
                                        borderRadius: 10,
                                        border: "1px solid var(--border-subtle)",
                                    }}
                                />
                                <input
                                    type="text"
                                    value={form.imageUrl}
                                    onChange={(e) => handleFormChange("imageUrl", e.target.value)}
                                    placeholder="или вставьте URL"
                                    style={{
                                        ...inputBase,
                                        fontSize: 12,
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* чекбоксы */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                            <input
                                type="checkbox"
                                checked={form.inStock}
                                onChange={(e) => handleFormChange("inStock", e.target.checked)}
                            />
                            В наличии
                        </label>

                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => handleFormChange("isActive", e.target.checked)}
                            />
                            Активен
                        </label>
                    </div>

                    {/* кнопки */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <Button type="submit">{editingId ? "Сохранить изменения" : "Добавить товар"}</Button>
                        {editingId && (
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                Отменить
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            {loading && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Загрузка списка товаров...</div>}

            {error && (
                <div style={{ padding: 10, borderRadius: 8, backgroundColor: "#fee2e2", color: "#991b1b", fontSize: 13 }}>
                    {error}
                </div>
            )}

            {!loading && products.length === 0 && <div style={{ fontSize: 13 }}>Товаров пока нет.</div>}

            {/* ✅ БЕЗ overflowX:auto + вместо таблицы — карточки (mobile-first, без горизонтального скролла) */}
            {!loading && products.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {products.map((p) => {
                        const activeLabel = p.isActive ? "Да" : "Нет";
                        const stockLabel = p.inStock ? "В наличии" : "Нет";

                        return (
                            <div
                                key={p._id}
                                style={{
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: 14,
                                    padding: 12,
                                    background: editingId === p._id ? "rgba(148, 163, 184, 0.08)" : "var(--bg-card, #fff)",
                                    minWidth: 0,
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, wordBreak: "break-word" }}>{p.title}</div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            {p.category?.name || "—"} • {p.price} ₽
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)", flex: "0 0 auto" }}>
                                        Активен: <strong style={{ color: "inherit" }}>{activeLabel}</strong>
                                    </div>
                                </div>

                                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12 }}>
                                    <span>Наличие: <strong>{stockLabel}</strong></span>
                                    {p.manufacturer ? <span>Производитель: <strong>{p.manufacturer}</strong></span> : null}
                                    {p.weight ? <span>Вес: <strong>{p.weight}</strong></span> : null}
                                    {p.volume ? <span>Объём: <strong>{p.volume}</strong></span> : null}
                                </div>

                                <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(p)}
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#2563eb",
                                            cursor: "pointer",
                                            fontSize: 13,
                                            padding: 0,
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
                                            fontSize: 13,
                                            padding: 0,
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ Если хочешь на десктопе обратно таблицу — скажи, сделаю через CSS media query, но мобилки без скролла */}
        </div>
    );
};

export default AdminProductsPage;
