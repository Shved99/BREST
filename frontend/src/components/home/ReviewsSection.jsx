// src/components/home/ReviewsSection.jsx
import React from "react";

const reviews = [
    {
        name: "Алексей, Москва",
        text: "Заказывала молочную продукцию и конфеты. Всё приехало свежим, аккуратно упакованным. Вкус — как из детства.",
    },
    {
        name: "Сергей, Санкт-Петербург",
        text: "Особенно понравились колбасы и сервелат. Чувствуется, что продукция не из масс-маркета.",
    },
    {
        name: "Дмитрий, Нижний Новгород",
        text: "Берём здесь косметику «Белита-Витекс» и сувениры. Удобно, что всё белорусское в одном месте.",
    },
];

// если файл лежит в public/uploads/reviews.png
const AVATAR_SRC = "/reviews.png";

const ReviewsSection = () => {
    return (
        <section className="section" id="reviews">
            <div className="section-subtitle">Отзывы покупателей</div>
            <h2 className="section-title">Что говорят клиенты</h2>

            <div className="grid grid-3">
                {reviews.map((review) => (
                    <div
                        key={review.name}
                        className="card"
                        style={{ display: "flex", flexDirection: "column", gap: 8 }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                overflow: "hidden",
                                marginBottom: 4,
                                backgroundColor: "var(--primary-soft)",
                            }}
                        >
                            <img
                                src={AVATAR_SRC}
                                alt={review.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                                lineHeight: 1.5,
                            }}
                        >
                            “{review.text}”
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{review.name}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReviewsSection;
