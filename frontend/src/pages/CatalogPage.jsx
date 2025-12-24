// src/pages/CatalogPage.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";
import ProductCard from "../components/common/ProductCard.jsx";

const CatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState([]);
    const [productsData, setProductsData] = useState({
        items: [],
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // читаем категорию из URL отдельно (источник истины для URL)
    const categoryParam = searchParams.get("category") || "";

    // Фильтры / сортировка
    const [filters, setFilters] = useState({
        category: categoryParam,
        minPrice: "",
        maxPrice: "",
        manufacturer: "",
        inStock: false,
        sort: "new",
        page: 1,
        limit: 12,
    });

    // 1) Если пользователь меняет URL (назад/вперёд/вручную) — обновляем filters.category
    useEffect(() => {
        setFilters((prev) => {
            if (prev.category === categoryParam) return prev;
            return { ...prev, category: categoryParam, page: 1 };
        });
    }, [categoryParam]);

    // Базовые стили
    const inputStyle = useMemo(
        () => ({
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid var(--border-subtle, rgba(0,0,0,.12))",
            background: "var(--bg-input, #fff)",
            fontSize: 13,
            outline: "none",
        }),
        []
    );

    const pillSelectStyle = useMemo(
        () => ({
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid var(--border-subtle, rgba(0,0,0,.12))",
            background: "var(--bg-input, #fff)",
            fontSize: 13,
            outline: "none",
        }),
        []
    );

    // Загрузка категорий (один раз)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosClient.get("/categories");
                setCategories(res.data || []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCategories();
    }, []);

    // Загрузка товаров (БЕЗ setSearchParams внутри!)
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page: filters.page,
                limit: filters.limit,
                sort: filters.sort,
            };

            if (filters.category) params.category = filters.category;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.manufacturer) params.manufacturer = filters.manufacturer;
            if (filters.inStock) params.inStock = "true";

            const res = await axiosClient.get("/products", { params });

            setProductsData({
                items: res.data.items || [],
                total: res.data.total || 0,
                page: res.data.page || 1,
                totalPages: res.data.totalPages || 1,
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить товары. Попробуйте обновить страницу.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // 2) При изменении filters — грузим товары
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // 3) Синхронизируем URL ТОЛЬКО когда реально меняется filters.category
    useEffect(() => {
        const current = searchParams.get("category") || "";
        const next = filters.category || "";

        if (current === next) return;

        const newParams = {};
        if (next) newParams.category = next;

        setSearchParams(newParams, { replace: true });
    }, [filters.category, searchParams, setSearchParams]);

    // Обработчики фильтров
    const handleCategoryChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            category: e.target.value,
            page: 1,
        }));
    };

    const handleSortChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            sort: e.target.value,
            page: 1,
        }));
    };

    const handlePriceChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value.replace(/[^\d]/g, ""),
            page: 1,
        }));
    };

    const handleManufacturerChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            manufacturer: e.target.value,
            page: 1,
        }));
    };

    const handleInStockChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            inStock: e.target.checked,
            page: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > productsData.totalPages) return;
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleAddToCart = (product) => {
        console.log("ADD TO CART:", product.title);
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "260px minmax(0, 1fr)",
                gap: 24,
                alignItems: "start",
            }}
        >
            {/* Сайдбар фильтров */}
            <aside style={{ alignSelf: "start" }}>
                <div
                    className="card"
                    style={{
                        position: "sticky",
                        top: "calc(var(--header-height, 64px) + 16px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        padding: 16,
                        borderRadius: 16,
                        border: "1px solid var(--border-subtle, rgba(0,0,0,.12))",
                        background: "var(--bg-card, #fff)",
                    }}
                >
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Фильтры</div>

                    {/* Категория */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Категория</label>
                        <select value={filters.category} onChange={handleCategoryChange} style={inputStyle}>
                            <option value="">Все категории</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Цена */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Цена, ₽</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="от"
                                value={filters.minPrice}
                                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="до"
                                value={filters.maxPrice}
                                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            />
                        </div>
                    </div>

                    {/* Производитель */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 500 }}>Производитель</label>
                        <input
                            type="text"
                            placeholder="Например, Коммунарка"
                            value={filters.manufacturer}
                            onChange={handleManufacturerChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Наличие */}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 13,
                            userSelect: "none",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={handleInStockChange}
                            style={{ accentColor: "var(--accent, #ef4444)" }}
                        />
                        Только в наличии
                    </label>
                </div>
            </aside>

            {/* Список товаров */}
            <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Верхняя панель */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ fontSize: 14 }}>
                        Найдено товаров: <span style={{ fontWeight: 600 }}>{productsData.total}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--text-muted, #6b7280)" }}>Сортировать:</span>
                        <select value={filters.sort} onChange={handleSortChange} style={pillSelectStyle}>
                            <option value="new">Сначала новинки</option>
                            <option value="price_asc">По цене: по возрастанию</option>
                            <option value="price_desc">По цене: по убыванию</option>
                            <option value="popular">По популярности</option>
                        </select>
                    </div>
                </div>

                {/* Состояния */}
                {loading && (
                    <div
                        style={{
                            padding: 24,
                            textAlign: "center",
                            fontSize: 14,
                            color: "var(--text-muted, #6b7280)",
                        }}
                    >
                        Загрузка товаров...
                    </div>
                )}

                {error && !loading && (
                    <div
                        style={{
                            padding: 16,
                            borderRadius: 12,
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontSize: 13,
                        }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && productsData.items.length === 0 && (
                    <div
                        style={{
                            padding: 24,
                            borderRadius: 12,
                            backgroundColor: "var(--bg-muted, rgba(0,0,0,.04))",
                            fontSize: 14,
                        }}
                    >
                        По выбранным фильтрам товаров не найдено. Попробуйте изменить параметры поиска.
                    </div>
                )}

                {/* Сетка товаров */}
                {!loading && !error && productsData.items.length > 0 && (
                    <div className="grid grid-3">
                        {productsData.items.map((product) => (
                            <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                )}

                {/* Пагинация */}
                {!loading && productsData.totalPages > 1 && (
                    <div
                        style={{
                            marginTop: 16,
                            display: "flex",
                            justifyContent: "center",
                            gap: 8,
                            fontSize: 13,
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            className="btn btn-outline"
                            disabled={productsData.page <= 1}
                            onClick={() => handlePageChange(productsData.page - 1)}
                        >
                            ← Назад
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            Страница <strong>{productsData.page}/{productsData.totalPages}</strong>
                        </div>

                        <button
                            className="btn btn-outline"
                            disabled={productsData.page >= productsData.totalPages}
                            onClick={() => handlePageChange(productsData.page + 1)}
                        >
                            Вперёд →
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CatalogPage;
