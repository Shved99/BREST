// src/components/home/Advantages.jsx
import React from "react";

const advantages = [
    {
        title: "Натуральные продукты",
        text: "Подбираем производителя и ассортимент так, чтобы сохранить вкус и качество белорусских товаров.",
    },
    {
        title: "Прямые поставки из Беларуси",
        text: "Работаем с официальными партнёрами и проверенными поставщиками без лишних посредников.",
    },
    {
        title: "Доставка по всей России и СНГ",
        text: "Отправляем заказы в крупные города и небольшие населённые пункты удобными службами доставки.",
    },
];

const Advantages = () => {
    return (
        <section className="section" id="advantages">
            <div className="section-subtitle">Почему нас выбирают</div>
            <h2 className="section-title">Преимущества магазина</h2>

            <div className="grid grid-3">
                {advantages.map((item) => (
                    <div
                        key={item.title}
                        className="card"
                        style={{ display: "flex", flexDirection: "column", gap: 8 }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                backgroundColor: "var(--secondary-soft)",
                                marginBottom: 4,
                            }}
                        />
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                            {item.text}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Advantages;
