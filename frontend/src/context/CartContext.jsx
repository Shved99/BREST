/* eslint-disable react-refresh/only-export-components */
// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { normalizeImageUrl } from "../utils/imageHelper.js";

const CartContext = createContext(null);

const STORAGE_KEY = "belarus_market_cart_v1";

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        // защита на случай SSR / отсутствия window
        if (typeof window === "undefined") return [];

        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Ошибка чтения корзины из localStorage", e);
            return [];
        }
    });

    // сохранение в localStorage
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            }
        } catch (e) {
            console.error("Ошибка сохранения корзины", e);
        }
    }, [items]);

    const addToCart = (product, qty = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.productId === product._id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [
                ...prev,
                {
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    quantity: qty,
                    image:
                        product.images && product.images.length > 0
                            ? normalizeImageUrl(product.images[0])
                            : null,
                    manufacturer: product.manufacturer || "",
                    weight: product.weight || "",
                    volume: product.volume || "",
                },
            ];
        });
    };

    const removeFromCart = (productId) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId, qty) => {
        const quantity = Math.max(1, qty);
        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
