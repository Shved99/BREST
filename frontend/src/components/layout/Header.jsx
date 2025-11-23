// src/components/layout/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "../common/Container.jsx";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header
            style={{
                height: "var(--header-height)",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid var(--border-subtle)",
                position: "sticky",
                top: 0,
                zIndex: 20,
                backdropFilter: "blur(8px)",
            }}
        >
            <Container
                className="header-inner"
                style={{ height: "100%", display: "flex", alignItems: "center" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            background:
                                "linear-gradient(135deg, var(--primary), var(--secondary))",
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700, fontSize: 18 }}>Беларусь Маркет</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              натуральные товары из Беларуси
            </span>
                    </div>
                </div>

                <nav
                    style={{
                        marginLeft: "40px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flex: 1,
                    }}
                >
                    <NavLink
                        to="/"
                        style={({ isActive }) => ({
                            fontSize: 14,
                            fontWeight: 500,
                            color: isActive ? "var(--primary)" : "var(--text-muted)",
                        })}
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="/catalog"
                        style={({ isActive }) => ({
                            fontSize: 14,
                            fontWeight: 500,
                            color: isActive ? "var(--primary)" : "var(--text-muted)",
                        })}
                    >
                        Каталог
                    </NavLink>
                    <a
                        href="#advantages"
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "var(--text-muted)",
                        }}
                    >
                        Преимущества
                    </a>
                    <a
                        href="#reviews"
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "var(--text-muted)",
                        }}
                    >
                        Отзывы
                    </a>
                </nav>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            Доставка по России и СНГ
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                            +7 (900) 000-00-00
                        </div>
                    </div>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate("/cart")}
                    >
                        Корзина
                    </button>
                </div>
            </Container>
        </header>
    );
};

export default Header;
