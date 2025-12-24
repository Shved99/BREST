// src/components/layout/Header.jsx
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Container from "../common/Container.jsx";
import { useCart } from "../../context/CartContext.jsx";
import logo from "../../../public/logo.png"; // поправь путь, если он другой

const DELIVERY_TEXT =
    "Доставка по Москве от 2000р. – 400р., от 4000р. – бесплатно. Доставка за пределы МКАД от 4000р., оплачивается только расстояние от МКАД";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems } = useCart();

    const handleScrollLink = (sectionId) => {
        // если уже на главной — просто скроллим
        if (location.pathname === "/") {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
            return;
        }

        // если на другой странице — переходим на / и передаём, к какому блоку скроллить
        navigate("/", { state: { scrollTo: sectionId } });
    };

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
            }}
        >
            {/* Верхняя серая панель */}
            <div
                style={{
                    backgroundColor: "#e5e5e5",
                    borderBottom: "1px solid #d4d4d4",
                    fontSize: 14,
                }}
            >
                <Container
                    style={{
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <nav
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 24,
                        }}
                    >
                        <NavLink
                            to="/"
                            style={({ isActive }) => ({
                                color: "#111827",
                                textDecoration: "none",
                                fontWeight: isActive ? 600 : 400,
                            })}
                        >
                            Главная
                        </NavLink>

                        <NavLink
                            to="/catalog"
                            style={({ isActive }) => ({
                                color: "#111827",
                                textDecoration: "none",
                                fontWeight: isActive ? 600 : 400,
                            })}
                        >
                            Каталог
                        </NavLink>

                        {/* О компании — кнопка со скроллом */}
                        <button
                            type="button"
                            onClick={() => handleScrollLink("about")}
                            style={{
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                margin: 0,
                                color: "#111827",
                                cursor: "pointer",
                                font: "inherit",
                            }}
                        >
                            О компании
                        </button>
                    </nav>

                    <div style={{ color: "#111827" }}>Доставка с 9:00 до 21:00</div>
                </Container>
            </div>

            {/* Основной зелёный хедер */}
            <div
                style={{
                    backgroundColor: "#97c78c",
                    borderBottom: "1px solid #7da573",
                }}
            >
                <Container
                    style={{
                        height: 72,
                        display: "grid",
                        gridTemplateColumns: "auto auto minmax(0,1fr) auto auto",
                        alignItems: "center",
                        columnGap: 16,
                    }}
                >
                    {/* Логотип */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logo}
                            alt="Беларусь Маркет"
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #e4e4e4",
                                backgroundColor: "#ffffff",
                                display: "block",
                            }}
                        />
                    </div>

                    {/* Кнопка "Каталог" */}
                    <button
                        type="button"
                        onClick={() => navigate("/catalog")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 18px",
                            borderRadius: 4,
                            border: "none",
                            backgroundColor: "#4f7c4f",
                            color: "#ffffff",
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <span
                                style={{
                                    width: 12,
                                    height: 2,
                                    backgroundColor: "#ffffff",
                                    display: "block",
                                }}
                            />
                            <span
                                style={{
                                    width: 12,
                                    height: 2,
                                    backgroundColor: "#ffffff",
                                    display: "block",
                                }}
                            />
                            <span
                                style={{
                                    width: 12,
                                    height: 2,
                                    backgroundColor: "#ffffff",
                                    display: "block",
                                }}
                            />
                        </span>
                        Каталог
                    </button>

                    {/* Поиск */}
                    <SearchBar />

                    {/* Иконка поиска */}
                    <button
                        type="button"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 4,
                            border: "1px solid rgba(0,0,0,0.2)",
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                        }}
                    >
                        🔍
                    </button>

                    {/* Корзина */}
                    <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        style={{
                            position: "relative",
                            width: 36,
                            height: 36,
                            borderRadius: 4,
                            border: "1px solid rgba(0,0,0,0.2)",
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        🛒
                        {totalItems > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    minWidth: 18,
                                    height: 18,
                                    borderRadius: 999,
                                    backgroundColor: "#4f7c4f",
                                    color: "#ffffff",
                                    fontSize: 11,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0 4px",
                                }}
                            >
                                {totalItems}
                            </span>
                        )}
                    </button>
                </Container>
            </div>

            {/* Полоса условий доставки */}
            <div
                style={{
                    backgroundColor: "#4f7c4f",
                    color: "#ffffff",
                    fontSize: 12,
                }}
            >
                <Container
                    style={{
                        padding: "4px 0",
                    }}
                >
                    {DELIVERY_TEXT}
                </Container>
            </div>
        </header>
    );
};

const SearchBar = () => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        navigate(`/catalog?search=${encodeURIComponent(q)}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: "100%",
            }}
        >
            <div
                style={{
                    width: "100%",
                    backgroundColor: "#c4e1ba",
                    borderRadius: 4,
                    padding: "0 8px",
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Поиск"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        width: "100%",
                        fontSize: 14,
                    }}
                />
            </div>
        </form>
    );
};

export default Header;
