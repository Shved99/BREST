// src/seed/seed.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

// простая функция для генерации slug из title
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[«»]/g, "")                // убираем ёлочки
        .replace(/[^a-z0-9а-яё\s-]/gi, "")   // только буквы/цифры/пробелы/дефисы
        .trim()
        .replace(/\s+/g, "-")                // пробелы -> дефисы
        .replace(/-+/g, "-")                 // несколько дефисов -> один
        .replace(/^-|-$/g, "");              // убрать дефисы по краям
}

async function seed() {
    try {
        await connectDB();
        console.log("🚀 Начинаю наполнение базы данных...");

        // ===== Админ =====
        const adminEmail = "admin@belarus-market.local";
        const adminPassword = "admin123";

        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            admin = await User.create({
                email: adminEmail,
                passwordHash,
                role: "admin",
                isActive: true,
            });
            console.log("✅ Админ создан:", adminEmail, "(пароль:", adminPassword + ")");
        } else {
            console.log("ℹ️ Админ уже существует:", adminEmail);
        }

        // ===== Категории =====
        console.log("🧹 Очищаю коллекции Category и Product...");
        await Category.deleteMany({});
        await Product.deleteMany({});

        const categoriesData = [
            { name: "Молочная продукция", slug: "dairy" },
            { name: "Мясные деликатесы", slug: "meat" },
            { name: "Кондитерские изделия", slug: "sweets" },
            { name: "Напитки", slug: "drinks" },
            { name: "Соленья и консервы", slug: "pickles" },
            { name: "Замороженные полуфабрикаты", slug: "frozen" },
        ];

        const categories = await Category.insertMany(categoriesData);
        console.log(
            "✅ Категории созданы:",
            categories.map((c) => c.name).join(", ")
        );

        const catBySlug = {};
        categories.forEach((c) => {
            catBySlug[c.slug] = c._id;
        });

        // ===== Товары =====
        // ВАЖНО: картинки лежат в frontend/public,
        // поэтому в БД храним пути вида "/cheese.png", "/pelmeni.png" и т.п.
        // Физические файлы: frontend/public/cheese.png, frontend/public/pelmeni.png и т.д.

        const rawProducts = [
            // Молочная продукция
            {
                title: "Сыр полутвёрдый «Брест-Литовск» 45%",
                category: catBySlug["dairy"],
                description:
                    "Натуральный полутвёрдый сыр из коровьего молока, выдержанный по классической технологии.",
                price: 650,
                manufacturer: "Брестский молочный комбинат",
                weight: "200 г",
                images: ["/cheese.png"],
                inStock: true,
                stockCount: 50,
                isFeatured: true,
            },
            {
                title: "Овсяные хлопья классические",
                category: catBySlug["dairy"],
                description: "Классические овсяные хлопья для каши и выпечки.",
                price: 140,
                manufacturer: "Белзерно",
                weight: "400 г",
                images: ["/hlopia.png"],
                inStock: true,
                stockCount: 60,
            },

            // Мясные деликатесы
            {
                title: "Колбаса полукопчёная «Белорусская»",
                category: catBySlug["meat"],
                description:
                    "Классическая полукопчёная колбаса к бутербродам и мясной нарезке.",
                price: 520,
                manufacturer: "Минский мясокомбинат",
                weight: "400 г",
                images: ["/colbasa.png"],
                inStock: true,
                stockCount: 40,
                isFeatured: true,
            },
            {
                title: "Набор копчёностей ассорти",
                category: catBySlug["meat"],
                description:
                    "Ассорти копчёных деликатесов к праздничному столу и закускам.",
                price: 890,
                manufacturer: "Белорусские мясопродукты",
                weight: "500 г",
                images: ["/copchennosti.png"],
                inStock: true,
                stockCount: 25,
            },
            {
                title: "Мясной рулет домашний",
                category: catBySlug["meat"],
                description:
                    "Сочный мясной рулет по домашнему рецепту, готовый к подаче.",
                price: 610,
                manufacturer: "Брестский мясокомбинат",
                weight: "450 г",
                images: ["/meet.png"],
                inStock: true,
                stockCount: 30,
            },

            // Кондитерские изделия
            {
                title: "Конфеты ассорти «Коммунарка»",
                category: catBySlug["sweets"],
                description: "Шоколадные конфеты ассорти фабрики «Коммунарка».",
                price: 480,
                manufacturer: "Коммунарка",
                weight: "250 г",
                images: ["/main-img.png"],
                inStock: true,
                stockCount: 80,
                isFeatured: true,
            },

            // Напитки
            {
                title: "Ягодный морс",
                category: catBySlug["drinks"],
                description:
                    "Освежающий ягодный напиток без искусственных красителей и консервантов.",
                price: 190,
                manufacturer: "Белорусские напитки",
                volume: "1 л",
                images: ["/drink.png"],
                inStock: true,
                stockCount: 50,
            },

            // Соленья и консервы
            {
                title: "Огурцы маринованные хрустящие",
                category: catBySlug["pickles"],
                description:
                    "Классические маринованные огурцы по домашнему рецепту, хрустящие и ароматные.",
                price: 250,
                manufacturer: "Белконсервы",
                weight: "720 г",
                images: ["/ogurzy.png"],
                inStock: true,
                stockCount: 35,
                isFeatured: true,
            },
            {
                title: "Овощное ассорти маринованное",
                category: catBySlug["pickles"],
                description:
                    "Подборка маринованных овощей к горячим блюдам и мясу.",
                price: 270,
                manufacturer: "Белконсервы",
                weight: "900 г",
                images: ["/ovoshi.png"],
                inStock: true,
                stockCount: 28,
            },
            {
                title: "Ассорти солений по-белорусски",
                category: catBySlug["pickles"],
                description:
                    "Набор традиционных белорусских солений к застолью и закускам.",
                price: 390,
                manufacturer: "Белконсервы",
                weight: "1 кг",
                images: ["/solenia.png"],
                inStock: true,
                stockCount: 18,
            },

            // Замороженные полуфабрикаты
            {
                title: "Пельмени домашние",
                category: catBySlug["frozen"],
                description: "Пельмени с мясом по домашнему рецепту, замороженные.",
                price: 430,
                manufacturer: "Белзаморозка",
                weight: "800 г",
                images: ["/pelmeni.png"],
                inStock: true,
                stockCount: 45,
                isFeatured: true,
            },
        ];

        // добавляем slug каждому продукту, чтобы не было slug: null
        const productsData = rawProducts.map((p) => ({
            ...p,
            slug: p.slug || slugify(p.title),
        }));

        const products = await Product.insertMany(productsData);
        console.log("✅ Товары созданы:", products.length, "шт.");

        console.log("🎉 Наполнение базы завершено успешно.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Ошибка при наполнении БД:", err);
        process.exit(1);
    }
}

seed();
