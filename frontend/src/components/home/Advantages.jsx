// src/components/home/AdvantagesSection.jsx
import React from "react";

const advantages = [
    { title: "Натуральные продукты" },
    { title: "Прямые поставки из Беларуси" },
    { title: "Доставка по всей России" },
];

const AdvantagesSection = () => {
    return (
        <section
            id="about"
            className="section"
            style={{
                marginBottom: 40,
            }}
        >
            <h2
                className="section-title"
                style={{
                    fontSize: 16,
                    fontWeight: 600,
                    textAlign: "center",
                    marginBottom: 12,
                }}
            >
                Преимущества
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 12,
                    maxWidth: 900,
                    margin: "0 auto",
                }}
            >
                {advantages.map((item) => (
                    <div
                        key={item.title}
                        style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: 4,
                            padding: "10px 12px",
                            textAlign: "center",
                            fontSize: 14,
                            backgroundColor: "#f9fafb",
                        }}
                    >
                        {item.title}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdvantagesSection;
