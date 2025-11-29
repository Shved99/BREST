// src/components/home/NewProductsRow.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";
import ProductCard from "../common/ProductCard.jsx";

const NewProductsRow = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get("/products");
                const items = Array.isArray(res.data?.items) ? res.data.items : res.data;
                setProducts((items || []).slice(0, 5)); // берем первые 5
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <section style={{ marginBottom: 32 }}>
                <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 12,
                    }}
                >
                    Новинки
                </h2>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Загрузка товаров…</div>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section style={{ marginBottom: 32 }}>
            <h2
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 12,
                }}
            >
                Новинки
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                    gap: 12,
                }}
            >
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default NewProductsRow;
