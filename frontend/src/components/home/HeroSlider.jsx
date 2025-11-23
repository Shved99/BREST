// src/components/home/HeroSlider.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button.jsx";

const HeroSlider = () => {
    const navigate = useNavigate();

    return (
        <section
            className="section"
            style={{
                paddingTop: 24,
            }}
        >
            <div
                className="card"
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
                    gap: 24,
                    alignItems: "stretch",
                }}
            >
                {/* Левая часть — текст и CTA */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        justifyContent: "center",
                    }}
                >
                    <div className="badge badge-soft">
                        Прямые поставки из Беларуси
                    </div>
                    <h1
                        style={{
                            fontSize: 32,
                            lineHeight: 1.2,
                            margin: 0,
                        }}
                    >
                        Белорусские продукты
                        <br />
                        с доставкой по России и СНГ
                    </h1>
                    <p
                        style={{
                            fontSize: 15,
                            color: "var(--text-muted)",
                            maxWidth: 520,
                        }}
                    >
                        Молочная продукция, мясные деликатесы, знаменитые конфеты
                        «Коммунарка», косметика «Белита-Витекс» и атмосферные сувениры —
                        в одном интернет-магазине.
                    </p>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <Button onClick={() => navigate("/catalog")}>
                            Перейти в каталог
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                document
                                    .getElementById("advantages")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Почему мы
                        </Button>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 24,
                            marginTop: 8,
                            fontSize: 13,
                            color: "var(--text-muted)",
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 600 }}>100% оригинальная продукция</div>
                            <div>Работаем только с официальными поставщиками.</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Доставка по России и СНГ</div>
                            <div>От небольших городов до крупных мегаполисов.</div>
                        </div>
                    </div>
                </div>

                {/* Правая часть — условный слайдер/витрина */}
                <div
                    style={{
                        position: "relative",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        background:
                            "linear-gradient(135deg, rgba(179,40,45,0.12), rgba(27,127,74,0.16))",
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 260,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffffcc",
                            borderRadius: "var(--radius-md)",
                            padding: 12,
                            marginBottom: 12,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 12,
                                textTransform: "uppercase",
                                letterSpacing: 0.08,
                                color: "var(--text-muted)",
                                marginBottom: 4,
                            }}
                        >
                            Акция недели
                        </div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            Набор «Белорусский завтрак»
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                            Сыр, творог и конфеты — выгодный комплект для семьи.
                        </div>
                    </div>

                    {/* Карточки-тизеры товаров (пока статические) */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                            marginTop: "auto",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#ffffffdd",
                                borderRadius: "var(--radius-md)",
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}
                            >
                                Сыр «Брест-Литовск»
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                Полутвёрдый, 45% жирности.
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>от 650 ₽</div>
                        </div>

                        <div
                            style={{
                                backgroundColor: "#ffffffdd",
                                borderRadius: "var(--radius-md)",
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}
                            >
                                Конфеты «Коммунарка»
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                Ассорти для чаепитий.
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>от 480 ₽</div>
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            background:
                                "radial-gradient(circle at top right, rgba(255,255,255,0.7), transparent 60%)",
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSlider;
