// src/pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";
import Button from "../components/common/Button.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await axiosClient.get(`/products/${id}`);
                setProduct(res.data);
            } catch (e) {
                console.error(e);
                setError("Не удалось загрузить товар.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, qty);
    };

    if (loading) {
        return (
            <div style={{ padding: 24, fontSize: 14, color: "var(--text-muted)" }}>
                Загрузка товара...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div
                style={{
                    padding: 24,
                    borderRadius: 12,
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    fontSize: 14,
                }}
            >
                {error || "Товар не найден."}
            </div>
        );
    }

    const mainImage =
        product.images && product.images.length > 0 ? product.images[0] : null;

    return (
        <div
            className="card"
            style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1.4fr)",
                gap: 24,
            }}
        >
            {/* Левая часть — изображение */}
            <div
                style={{
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    backgroundColor: "var(--bg-muted)",
                    minHeight: 260,
                }}
            >
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: 260,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            color: "var(--text-muted)",
                        }}
                    >
                        Здесь будет фото товара
                    </div>
                )}
            </div>

            {/* Правая часть — информация */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                {product.category?.name && (
                    <div
                        style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: 0.08,
                        }}
                    >
                        {product.category.name}
                    </div>
                )}
                <h1
                    style={{
                        fontSize: 24,
                        margin: 0,
                    }}
                >
                    {product.title}
                </h1>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        fontSize: 13,
                        color: "var(--text-muted)",
                    }}
                >
                    {product.manufacturer && (
                        <div>
                            <strong>Производитель:</strong> {product.manufacturer}
                        </div>
                    )}
                    {(product.weight || product.volume) && (
                        <div>
                            <strong>Фасовка:</strong> {product.weight || product.volume}
                        </div>
                    )}
                    <div>
                        <strong>Страна:</strong> Беларусь
                    </div>
                    {product.inStock ? (
                        <div style={{ color: "var(--secondary)" }}>В наличии</div>
                    ) : (
                        <div style={{ color: "var(--primary)" }}>Нет в наличии</div>
                    )}
                </div>

                {product.description && (
                    <div
                        style={{
                            fontSize: 14,
                            lineHeight: 1.5,
                            marginTop: 4,
                        }}
                    >
                        {product.description}
                    </div>
                )}

                {/* Блок цены и количества */}
                <div
                    style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 12,
                        backgroundColor: "var(--bg-muted)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            color: "var(--text-muted)",
                        }}
                    >
                        Цена
                    </div>
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                        }}
                    >
                        {product.price} ₽
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginTop: 4,
                        }}
                    >
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                borderRadius: 999,
                                border: "1px solid var(--border-subtle)",
                                overflow: "hidden",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                style={{
                                    padding: "6px 10px",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                −
                            </button>
                            <input
                                type="text"
                                value={qty}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^\d]/g, "");
                                    setQty(v ? Number(v) : 1);
                                }}
                                style={{
                                    width: 40,
                                    textAlign: "center",
                                    border: "none",
                                    outline: "none",
                                    fontSize: 14,
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setQty((q) => q + 1)}
                                style={{
                                    padding: "6px 10px",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                +
                            </button>
                        </div>

                        <Button onClick={handleAddToCart}>Добавить в корзину</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
