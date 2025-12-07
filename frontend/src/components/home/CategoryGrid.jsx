// src/components/home/CategoryGrid.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
    {
        slug: "dairy",
        title: "Молочная продукция",
        description: "Сыры, творог, сметана и другие молочные продукты.",
        imageUrl: "/uploads/cheese.png",
    },
    {
        slug: "meat",
        title: "Мясные деликатесы",
        description: "Колбасы, ветчина и классические мясные деликатесы.",
        imageUrl: "/uploads/meet.png",
    },
    {
        slug: "sweets",
        title: "Кондитерские изделия",
        description: "Шоколад и конфеты «Коммунарка» и другие сладости.",
        imageUrl: "/uploads/pelmeni.png",
    },
    {
        slug: "cosmetics",
        title: "Косметика",
        description: "«Белита-Витекс», «Vitex» и другие бренды из Беларуси.",
        imageUrl: "/uploads/main-img.png",
    },
    {
        slug: "souvenirs",
        title: "Сувениры и товары для дома",
        description: "Льняные изделия, керамика и атмосферные сувениры.",
        imageUrl: "/uploads/solenia.png",
    },
];

const CategoryGrid = () => {
    const navigate = useNavigate();

    const handleClick = (slug) => {
        navigate(`/catalog?category=${slug}`);
    };

    return (
        <section className="section">
            <div className="section-subtitle">Категории</div>
            <h2 className="section-title">Популярные разделы</h2>

            <div className="grid grid-3">
                {categories.map((cat) => (
                    <button
                        key={cat.slug}
                        onClick={() => handleClick(cat.slug)}
                        style={{
                            textAlign: "left",
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            cursor: "pointer",
                        }}
                    >
                        <div
                            className="card"
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: "var(--bg-muted)",
                                    marginBottom: 4,
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {cat.imageUrl ? (
                                    <img
                                        src={cat.imageUrl}
                                        alt={cat.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                ) : null}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{cat.title}</div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                {cat.description}
                            </div>
                            <div
                                style={{
                                    marginTop: "auto",
                                    fontSize: 13,
                                    color: "var(--primary)",
                                    fontWeight: 500,
                                }}
                            >
                                Смотреть товары →
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
