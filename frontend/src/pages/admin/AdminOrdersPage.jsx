// src/pages/admin/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import Button from "../../components/common/Button.jsx";

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
    }, [statusFilter]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosClient.put(`/admin/orders/${orderId}`, {
                status: newStatus,
            });
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                )
            );
        } catch (e) {
            console.error(e);
            alert("Не удалось обновить статус.");
        }
    };

    return (
        <div className="card" style={{ padding: 16 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    gap: 12,
                }}
            >
                <h1 style={{ fontSize: 18, margin: 0 }}>Заказы</h1>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: "1px solid var(--border-subtle)",
                            fontSize: 13,
                        }}
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

            {!loading && orders.length === 0 && (
                <div style={{ fontSize: 13 }}>Заказов пока нет.</div>
            )}

            {!loading && orders.length > 0 && (
                <div style={{ overflowX: "auto" }}>
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
                            <th style={{ padding: "8px 6px" }}>№</th>
                            <th style={{ padding: "8px 6px" }}>Клиент</th>
                            <th style={{ padding: "8px 6px" }}>Телефон</th>
                            <th style={{ padding: "8px 6px" }}>Сумма</th>
                            <th style={{ padding: "8px 6px" }}>Статус</th>
                            <th style={{ padding: "8px 6px" }}>Создан</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((o, index) => (
                            <tr
                                key={o._id}
                                style={{
                                    borderBottom: "1px solid var(--border-subtle)",
                                }}
                            >
                                <td style={{ padding: "6px" }}>{index + 1}</td>
                                <td style={{ padding: "6px" }}>
                                    {o.customer?.fullName || "—"}
                                </td>
                                <td style={{ padding: "6px" }}>{o.customer?.phone}</td>
                                <td style={{ padding: "6px" }}>{o.totalAmount} ₽</td>
                                <td style={{ padding: "6px" }}>
                                    <select
                                        value={o.status}
                                        onChange={(e) =>
                                            handleStatusChange(o._id, e.target.value)
                                        }
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: 999,
                                            border: "1px solid var(--border-subtle)",
                                        }}
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ padding: "6px" }}>
                                    {o.createdAt
                                        ? new Date(o.createdAt).toLocaleString()
                                        : "—"}
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

export default AdminOrdersPage;
