// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";
import { useCart } from "../context/CartContext.jsx";
import Button from "../components/common/Button.jsx";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        paymentMethod: "cash_on_delivery",
        comment: "",
    });
    const [loading, setLoading] = useState(false);
    const [successOrderId, setSuccessOrderId] = useState(null);
    const [error, setError] = useState("");

    if (items.length === 0 && !successOrderId) {
        return (
            <div className="card" style={{ padding: 24 }}>
                <h1 style={{ fontSize: 20, margin: 0 }}>Оформление заказа</h1>
                <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-muted)" }}>
                    Ваша корзина пуста. Добавьте товары в корзину, прежде чем оформлять заказ.
                </div>
                <Button style={{ marginTop: 12 }} onClick={() => navigate("/catalog")}>
                    В каталог
                </Button>
            </div>
        );
    }

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.fullName || !form.phone || !form.address) {
            setError("Заполните ФИО, телефон и адрес.");
            return;
        }

        const orderItems = items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
        }));

        try {
            setLoading(true);
            const res = await axiosClient.post("/orders", {
                items: orderItems,
                customer: {
                    fullName: form.fullName,
                    phone: form.phone,
                    address: form.address,
                },
                paymentMethod: form.paymentMethod,
                comment: form.comment,
            });

            setSuccessOrderId(res.data.orderId);
            clearCart();
        } catch (e) {
            console.error(e);
            setError("Не удалось оформить заказ. Попробуйте ещё раз.");
        } finally {
            setLoading(false);
        }
    };

    if (successOrderId) {
        return (
            <div className="card" style={{ padding: 24 }}>
                <h1 style={{ fontSize: 20, margin: 0 }}>Заказ оформлен</h1>
                <div style={{ marginTop: 8, fontSize: 14 }}>
                    Спасибо за заказ! Номер вашего заказа:{" "}
                    <strong>{successOrderId}</strong>.
                </div>
                <div
                    style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: "var(--text-muted)",
                    }}
                >
                    Мы свяжемся с вами для подтверждения деталей доставки.
                </div>
                <Button style={{ marginTop: 16 }} onClick={() => navigate("/")}>
                    На главную
                </Button>
            </div>
        );
    }

    return (
        <div
            className="card"
            style={{
                padding: 24,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1.1fr)",
                gap: 24,
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
                <h1 style={{ fontSize: 20, margin: 0 }}>Оформление заказа</h1>

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

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>ФИО</label>
                    <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="Иванов Иван Иванович"
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>Телефон</label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+7 ..."
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>Адрес доставки</label>
                    <textarea
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Город, улица, дом, квартира"
                        rows={3}
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                            resize: "vertical",
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>
                        Способ оплаты
                    </label>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            fontSize: 13,
                        }}
                    >
                        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input
                                type="radio"
                                name="payment"
                                value="cash_on_delivery"
                                checked={form.paymentMethod === "cash_on_delivery"}
                                onChange={(e) =>
                                    handleChange("paymentMethod", e.target.value)
                                }
                            />
                            При получении
                        </label>
                        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input
                                type="radio"
                                name="payment"
                                value="online"
                                checked={form.paymentMethod === "online"}
                                onChange={(e) =>
                                    handleChange("paymentMethod", e.target.value)
                                }
                            />
                            Онлайн-оплата (по согласованию)
                        </label>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500 }}>Комментарий</label>
                    <textarea
                        value={form.comment}
                        onChange={(e) => handleChange("comment", e.target.value)}
                        placeholder="Уточните удобное время звонка или дополнительные пожелания"
                        rows={2}
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                            resize: "vertical",
                        }}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Отправка заказа..." : "Оформить заказ"}
                </Button>
            </form>

            {/* Блок итогов справа */}
            <aside
                style={{
                    borderRadius: 12,
                    backgroundColor: "var(--bg-muted)",
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontSize: 13,
                }}
            >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Ваш заказ</div>
                {items.map((item) => (
                    <div
                        key={item.productId}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                        }}
                    >
                        <div>
                            <div>{item.title}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                                {item.quantity} × {item.price} ₽
                            </div>
                        </div>
                        <div style={{ fontWeight: 600 }}>
                            {item.price * item.quantity} ₽
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px dashed var(--border-subtle)",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Итого к оплате</span>
                    <span style={{ fontWeight: 700 }}>{totalAmount} ₽</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    Стоимость доставки уточняется при подтверждении заказа.
                </div>
            </aside>
        </div>
    );
};

export default CheckoutPage;
