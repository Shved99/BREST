// src/components/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Container from "../common/Container.jsx";

const Layout = () => {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main className="app-main">
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
