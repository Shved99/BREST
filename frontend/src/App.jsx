// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";

function App() {
    return (
        <Routes>
            {/* Публичный layout */}
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* Админ: логин отдельной страницей без публичного хедера */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Админский layout */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>
        </Routes>
    );
}

export default App;
