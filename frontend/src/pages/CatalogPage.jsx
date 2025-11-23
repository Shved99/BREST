// src/pages/CatalogPage.jsx
import React, { useEffect, useState, useCallback } from "react";
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

    // Фильтры / сортировка
    const [filters, setFilters] = useState({
        category: searchParams.get("category") || "",
        minPrice: "",
        maxPrice: "",
        manufacturer: "",
        inStock: false,
        sort: "new",
        page: 1,
        limit: 12,
    });

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

    // Загрузка товаров
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

            // синхронизируем URL с фильтром категории
            const newParams = {};
            if (filters.category) newParams.category = filters.category;
            setSearchParams(newParams, { replace: true });
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить товары. Попробуйте обновить страницу.");
        } finally {
            setLoading(false);
        }
    }, [filters, setSearchParams]);

    // При изменении фильтров — загрузка товаров
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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

    // Пока корзину не делаем — заглушка
    const handleAddToCart = (product) => {
        console.log("ADD TO CART:", product.title);
        // здесь позже подключим контекст/стейт корзины
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "260px minmax(0, 1fr)",
                gap: 24,
            }}
        >
            {/* Сайдбар фильтров */}
            <aside>
                <div
                    className="card"
                    style={{
                        position: "sticky",
                        top: "calc(var(--header-height) + 16px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Фильтры</div>

                    {/* Категория */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                marginBottom: 2,
                            }}
                        >
                            Категория
                        </label>
                        <select
                            value={filters.category}
                            onChange={handleCategoryChange}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        >
                            <option value="">Все категории</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Цена */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                marginBottom: 2,
                            }}
                        >
                            Цена, ₽
                        </label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                type="text"
                                placeholder="от"
                                value={filters.minPrice}
                                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid var(--border-subtle)",
                                    fontSize: 13,
                                }}
                            />
                            <input
                                type="text"
                                placeholder="до"
                                value={filters.maxPrice}
                                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid var(--border-subtle)",
                                    fontSize: 13,
                                }}
                            />
                        </div>
                    </div>

                    {/* Производитель */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                marginBottom: 2,
                            }}
                        >
                            Производитель
                        </label>
                        <input
                            type="text"
                            placeholder="Например, Коммунарка"
                            value={filters.manufacturer}
                            onChange={handleManufacturerChange}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        />
                    </div>

                    {/* Наличие */}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={handleInStockChange}
                        />
                        Только в наличии
                    </label>
                </div>
            </aside>

            {/* Список товаров */}
            <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Верхняя панель: счётчик и сортировка */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                    }}
                >
                    <div style={{ fontSize: 14 }}>
                        Найдено товаров:{" "}
                        <span style={{ fontWeight: 600 }}>{productsData.total}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Сортировать:
            </span>
                        <select
                            value={filters.sort}
                            onChange={handleSortChange}
                            style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                border: "1px solid var(--border-subtle)",
                                fontSize: 13,
                            }}
                        >
                            <option value="new">Сначала новинки</option>
                            <option value="price_asc">По цене: по возрастанию</option>
                            <option value="price_desc">По цене: по убыванию</option>
                            <option value="popular">По популярности</option>
                        </select>
                    </div>
                </div>

                {/* Состояния загрузки/ошибки/пусто */}
                {loading && (
                    <div
                        style={{
                            padding: 24,
                            textAlign: "center",
                            fontSize: 14,
                            color: "var(--text-muted)",
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
                            backgroundColor: "var(--bg-muted)",
                            fontSize: 14,
                        }}
                    >
                        По выбранным фильтрам товаров не найдено. Попробуйте изменить
                        параметры поиска.
                    </div>
                )}

                {/* Сетка товаров */}
                {!loading && !error && productsData.items.length > 0 && (
                    <div className="grid grid-3">
                        {productsData.items.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
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
                        }}
                    >
                        <button
                            className="btn btn-outline"
                            disabled={productsData.page <= 1}
                            onClick={() => handlePageChange(productsData.page - 1)}
                        >
                            ← Назад
                        </button>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            Страница{" "}
                            <strong>
                                {productsData.page}/{productsData.totalPages}
                            </strong>
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
