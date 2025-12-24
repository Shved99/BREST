// src/components/common/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { normalizeImageUrl } from "../../utils/imageHelper.js";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleOpen = () => {
        navigate(`/product/${product._id}`);
    };

    const mainImage =
        product.images && product.images.length > 0
            ? normalizeImageUrl(product.images[0])
            : null;

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    return (
        <div
            className="card"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                height: "100%",
            }}
        >
            {/* ... остальная разметка та же, меняем только onAddToCart */}
            <div
                onClick={handleOpen}
                style={{
                    cursor: "pointer",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    backgroundColor: "var(--bg-muted)",
                    height: 160,
                    position: "relative",
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            color: "var(--text-muted)",
                        }}
                    >
                        Фото будет позже
                    </div>
                )}
            </div>

            {/* Текст и цена — как было */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    flex: 1,
                }}
            >
                {product.category?.name && (
                    <div
                        style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                        }}
                    >
                        {product.category.name}
                    </div>
                )}
                <div
                    onClick={handleOpen}
                    style={{
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                    }}
                >
                    {product.title}
                </div>
                {product.manufacturer && (
                    <div
                        style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                        }}
                    >
                        Производитель: {product.manufacturer}
                    </div>
                )}
                {(product.weight || product.volume) && (
                    <div
                        style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                        }}
                    >
                        {product.weight || product.volume}
                    </div>
                )}
            </div>

            <div
                style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                }}
            >
                <div>
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
                            fontSize: 16,
                            fontWeight: 700,
                        }}
                    >
                        {product.price} ₽
                    </div>
                </div>
                <Button onClick={handleAddToCart}>В корзину</Button>
            </div>
        </div>
    );
};

export default ProductCard;
