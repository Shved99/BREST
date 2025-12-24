// src/pages/admin/AdminOrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import Button from "../../components/common/Button.jsx";
import { normalizeImageUrl } from "../../utils/imageHelper.js";

const statusOptions = [
    { value: "new", label: "Новый" },
    { value: "processing", label: "Обрабатывается" },
    { value: "shipped", label: "Отправлен" },
    { value: "delivered", label: "Доставлен" },
];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const inputBase = useMemo(
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

    const pillSelect = useMemo(
        () => ({
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid var(--border-subtle, rgba(0,0,0,.12))",
            background: "var(--bg-input, #fff)",
            fontSize: 13,
            outline: "none",
            maxWidth: "100%",
        }),
        []
    );

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const params = {};
            if (statusFilter) params.status = statusFilter;
            const res = await axiosClient.get("/admin/orders", { params });
            setOrders(res.data || []);
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить заказы.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosClient.put(`/admin/orders/${orderId}`, { status: newStatus });
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
            );
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
            }
        } catch (e) {
            console.error(e);
            alert("Не удалось обновить статус.");
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            const res = await axiosClient.get(`/admin/orders/${orderId}`);
            setSelectedOrder(res.data);
        } catch (e) {
            console.error(e);
            alert("Не удалось загрузить детали заказа.");
        }
    };

    const handleCloseDetails = () => setSelectedOrder(null);

    // ======= DETAILS =======
    if (selectedOrder) {
        return (
            <div className="card" style={{ padding: 16 }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 16,
                    }}
                >
                    <h1 style={{ fontSize: 18, margin: 0 }}>Заказ #{selectedOrder._id}</h1>
                    <div style={{ display: "flex" }}>
                        <Button variant="outline" onClick={handleCloseDetails}>
                            ← Назад к списку
                        </Button>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Информация о клиенте */}
                    <div
                        className="card"
                        style={{
                            padding: 12,
                            backgroundColor: "var(--bg-muted, rgba(0,0,0,.04))",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            fontSize: 13,
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            Информация о клиенте
                        </div>
                        <div>
                            <strong>ФИО:</strong> {selectedOrder.customer?.fullName || "—"}
                        </div>
                        <div>
                            <strong>Телефон:</strong> {selectedOrder.customer?.phone || "—"}
                        </div>
                        <div>
                            <strong>Адрес доставки:</strong>{" "}
                            {selectedOrder.customer?.address || "—"}
                        </div>
                        <div>
                            <strong>Способ оплаты:</strong>{" "}
                            {selectedOrder.paymentMethod === "online"
                                ? "Онлайн-оплата"
                                : "При получении"}
                        </div>
                        {selectedOrder.comment && (
                            <div>
                                <strong>Комментарий:</strong> {selectedOrder.comment}
                            </div>
                        )}
                    </div>

                    {/* Статус и дата (mobile-first: в колонку) */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: 12,
                            fontSize: 13,
                        }}
                    >
                        <div>
                            <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
                                Статус заказа
                            </label>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                style={inputBase}
                            >
                                {statusOptions.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
                                Дата создания
                            </label>
                            <div
                                style={{
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    backgroundColor: "var(--bg-muted, rgba(0,0,0,.04))",
                                    fontSize: 13,
                                }}
                            >
                                {selectedOrder.createdAt
                                    ? new Date(selectedOrder.createdAt).toLocaleString()
                                    : "—"}
                            </div>
                        </div>
                    </div>

                    {/* Товары в заказе */}
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
                            Товары в заказе
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {selectedOrder.items?.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "72px minmax(0, 1fr)",
                                        gap: 12,
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: "var(--bg-muted, rgba(0,0,0,.04))",
                                        fontSize: 13,
                                        alignItems: "start",
                                    }}
                                >
                                    {/* Фото */}
                                    <div
                                        style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={normalizeImageUrl(item.product.images[0])}
                                                alt={item.product?.title}
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
                                                    color: "var(--text-muted, #6b7280)",
                                                }}
                                            >
                                                Нет фото
                                            </div>
                                        )}
                                    </div>

                                    {/* Инфо + сумма (без третьей колонки, чтобы не было горизонтального скролла) */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 6,
                                            minWidth: 0,
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, wordBreak: "break-word" }}>
                                            {item.product?.title || "Товар удален"}
                                        </div>

                                        {item.product?.manufacturer && (
                                            <div style={{ color: "var(--text-muted, #6b7280)" }}>
                                                {item.product.manufacturer}
                                            </div>
                                        )}

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                            <span>Цена: {item.price} ₽</span>
                                            <span>Кол-во: {item.quantity} шт.</span>
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 4,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "baseline",
                                                gap: 10,
                                            }}
                                        >
                      <span style={{ color: "var(--text-muted, #6b7280)" }}>
                        Сумма:
                      </span>
                                            <span style={{ fontSize: 16, fontWeight: 700 }}>
                        {item.price * item.quantity} ₽
                      </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Итого */}
                    <div
                        style={{
                            padding: 16,
                            borderRadius: 12,
                            backgroundColor: "var(--bg-muted, rgba(0,0,0,.04))",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            fontSize: 14,
                        }}
                    >
                        <span style={{ fontWeight: 600 }}>Итого к оплате:</span>
                        <span style={{ fontWeight: 800, fontSize: 18 }}>
              {selectedOrder.totalAmount} ₽
            </span>
                    </div>
                </div>

                {/* Desktop enhancement без CSS-файла: на широких экранах можно разложить статус/дату в 2 колонки */}
                <style>{`
          @media (min-width: 900px) {
            .admin-order-meta-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
            </div>
        );
    }

    // ======= LIST (mobile-first, без горизонтального скролла) =======
    return (
        <div className="card" style={{ padding: 16 }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 16,
                }}
            >
                <h1 style={{ fontSize: 18, margin: 0 }}>Заказы</h1>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        alignItems: "stretch",
                    }}
                >
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ ...pillSelect, width: "100%" }}
                    >
                        <option value="">Все статусы</option>
                        {statusOptions.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>

                    <Button variant="outline" onClick={loadOrders}>
                        Обновить
                    </Button>
                </div>
            </div>

            {loading && (
                <div style={{ fontSize: 13, color: "var(--text-muted, #6b7280)" }}>
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

            {!loading && orders.length === 0 && (
                <div style={{ fontSize: 13 }}>Заказов пока нет.</div>
            )}

            {/* Мобильный список карточками вместо таблицы (убирает горизонтальный скролл) */}
            {!loading && orders.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {orders.map((o) => (
                        <div
                            key={o._id}
                            style={{
                                border: "1px solid var(--border-subtle, rgba(0,0,0,.12))",
                                borderRadius: 14,
                                padding: 12,
                                background: "var(--bg-card, #fff)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 10,
                                    alignItems: "baseline",
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: 14, minWidth: 0 }}>
                                    Заказ{" "}
                                    <span style={{ wordBreak: "break-word" }}>
                    #{String(o._id).slice(-6)}
                  </span>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: 14 }}>
                                    {o.totalAmount} ₽
                                </div>
                            </div>

                            <div style={{ fontSize: 13, color: "var(--text-muted, #6b7280)" }}>
                                {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ fontSize: 13 }}>
                                    <strong>Клиент:</strong> {o.customer?.fullName || "—"}
                                </div>
                                <div style={{ fontSize: 13 }}>
                                    <strong>Телефон:</strong> {o.customer?.phone || "—"}
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>Статус</div>
                                <select
                                    value={o.status}
                                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                    style={pillSelect}
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => handleViewDetails(o._id)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                        border: "1px solid var(--border-subtle, rgba(0,0,0,.12))",
                                        background: "transparent",
                                        cursor: "pointer",
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop enhancement: на больших экранах фильтр+кнопка в строку */}
            <style>{`
        @media (min-width: 900px) {
          .admin-orders-toolbar {
            flex-direction: row !important;
            align-items: center !important;
          }
          .admin-orders-toolbar select {
            width: auto !important;
            min-width: 240px;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminOrdersPage;
