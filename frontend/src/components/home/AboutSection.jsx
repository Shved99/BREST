// src/components/home/AboutSection.jsx
import React from "react";

const AboutSection = () => {
    return (
        <section
            id="about"
            style={{
                marginTop: 32,
                marginBottom: 24,
            }}
        >
            <h2
                style={{
                    fontSize: 16,
                    fontWeight: 600,
                    textAlign: "center",
                    marginBottom: 12,
                }}
            >
                О компании
            </h2>
            <p
                style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    maxWidth: 900,
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                Интернет-магазин белорусских продуктов «Брест» — ваш прямой путь к
                настоящему вкусу Беларуси в Москве. Мы предлагаем свежие и качественные
                продукты напрямую от проверенных белорусских производителей. В нашем
                каталоге — всё, что ценят белорусскую кухню: нежная молочная продукция,
                различные сыры, мясные деликатесы, домашние блюда, натуральные консервы
                и традиционные сладости.
            </p>
        </section>
    );
};

export default AboutSection;
