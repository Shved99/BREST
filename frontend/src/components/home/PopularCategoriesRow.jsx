// src/components/home/PopularCategoriesRow.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const popularCategories = [
    {
        slug: "meat",
        title: "Мясные изделия",
        imageUrl: "/images/home/cat-meat.jpg", // позже подставишь реальные
    },
    {
        slug: "cheese",
        title: "Сыры",
        imageUrl: "/images/home/cat-cheese.jpg",
    },
    {
        slug: "fruits-vegetables",
        title: "Овощи и фрукты",
        imageUrl: "/images/home/cat-fruits.jpg",
    },
    {
        slug: "pickles",
        title: "Соленья",
        imageUrl: "/images/home/cat-pickles.jpg",
    },
    {
        slug: "drinks",
        title: "Напитки",
        imageUrl: "/images/home/cat-drinks.jpg",
    },
];

const PopularCategoriesRow = () => {
    const navigate = useNavigate();

    const handleClick = (slug) => {
        navigate(`/catalog?category=${slug}`);
    };

    return (
        <section
            style={{
                marginTop: 24,
                marginBottom: 32,
            }}
        >
            <h2
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 12,
                }}
            >
                Популярные категории
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                    gap: 12,
                }}
            >
                {popularCategories.map((cat) => (
                    <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleClick(cat.slug)}
                        style={{
                            border: "none",
                            background: "transparent",
                            textAlign: "left",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                aspectRatio: "4 / 3",
                                borderRadius: 4,
                                overflow: "hidden",
                                backgroundColor: "#f3f4f6",
                                marginBottom: 4,
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
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12,
                                        color: "#6b7280",
                                    }}
                                >
                                    Фото позже
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: 13 }}>{cat.title}</div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default PopularCategoriesRow;
