// src/pages/CartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import Button from "../components/common/Button.jsx";

const CartPage = () => {
    const navigate = useNavigate();
    const {
        items,
        totalItems,
        totalAmount,
        removeFromCart,
        updateQuantity,
        clearCart,
    } = useCart();

    const handleGoToCheckout = () => {
        if (items.length === 0) return;
        navigate("/checkout");
    };

    if (items.length === 0) {
        return (
            <div
                className="card"
                style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}
            >
                <h1 style={{ fontSize: 20, margin: 0 }}>Корзина</h1>
                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    Ваша корзина пуста. Перейдите в каталог, чтобы выбрать товары.
                </div>
                <Button onClick={() => navigate("/catalog")}>В каталог</Button>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
                gap: 24,
            }}
        >
            {/* Список товаров */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h1 style={{ fontSize: 20, margin: 0 }}>Корзина</h1>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Товаров в корзине: {totalItems}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "80px minmax(0, 1.5fr) minmax(0, 1fr)",
                                gap: 12,
                                alignItems: "center",
                            }}
                        >
                            {/* Фото */}
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    backgroundColor: "var(--bg-muted)",
                                }}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
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
                                            fontSize: 11,
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        Фото позже
                                    </div>
                                )}
                            </div>

                            {/* Информация */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                >
                                    {item.title}
                                </div>
                                {item.manufacturer && (
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        Производитель: {item.manufacturer}
                                    </div>
                                )}
                                {(item.weight || item.volume) && (
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        {item.weight || item.volume}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeFromCart(item.productId)}
                                    style={{
                                        marginTop: 4,
                                        border: "none",
                                        background: "transparent",
                                        color: "var(--primary)",
                                        fontSize: 12,
                                        cursor: "pointer",
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>

                            {/* Кол-во и цена */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 6,
                                    fontSize: 13,
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
                                        onClick={() =>
                                            updateQuantity(item.productId, item.quantity - 1)
                                        }
                                        style={{
                                            padding: "4px 8px",
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        −
                                    </button>
                                    <div style={{ padding: "4px 8px", minWidth: 26, textAlign: "center" }}>
                                        {item.quantity}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQuantity(item.productId, item.quantity + 1)
                                        }
                                        style={{
                                            padding: "4px 8px",
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        Цена за шт.: {item.price} ₽
                                    </div>
                                    <div style={{ fontWeight: 600 }}>
                                        Сумма: {item.price * item.quantity} ₽
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={clearCart}
                    style={{
                        alignSelf: "flex-start",
                        border: "none",
                        background: "transparent",
                        color: "var(--text-muted)",
                        fontSize: 12,
                        cursor: "pointer",
                    }}
                >
                    Очистить корзину
                </button>
            </div>

            {/* Итоги и переход к заказу */}
            <aside
                className="card"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    alignSelf: "flex-start",
                }}
            >
                <div style={{ fontWeight: 600, fontSize: 16 }}>Итого</div>
                <div style={{ fontSize: 13 }}>
                    Товаров: <strong>{totalItems}</strong>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {totalAmount} ₽
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Окончательная стоимость доставки зависит от региона и будет
                    рассчитана при подтверждении заказа.
                </div>
                <Button onClick={handleGoToCheckout}>Перейти к оформлению</Button>
            </aside>
        </div>
    );
};

export default CartPage;
