// src/components/layout/Footer.jsx
import React from "react";
import Container from "../common/Container.jsx";

const Footer = () => {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border-subtle)",
                padding: "24px 0",
                backgroundColor: "#ffffff",
            }}
        >
            <Container>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        fontSize: 13,
                        color: "var(--text-muted)",
                    }}
                >
                    <div style={{ fontWeight: 600 }}>Интернет-магазин «Беларусь Маркет»</div>
                    <div>Натуральная продукция из Беларуси с доставкой по России и странам СНГ.</div>
                    <div>© {new Date().getFullYear()} Все права защищены.</div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
