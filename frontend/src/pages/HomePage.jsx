// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSlider from "../components/home/HeroSlider.jsx";
import CategoryGrid from "../components/home/CategoryGrid.jsx";
import AdvantagesSection from "../components/home/Advantages.jsx";
import ReviewsSection from "../components/home/ReviewsSection.jsx";

const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        const scrollTo = location.state?.scrollTo;
        if (!scrollTo) return;

        const t = setTimeout(() => {
            const el = document.getElementById(scrollTo);
            if (!el) return;

            const headerOffset = 120; // примерная высота хедера
            const rect = el.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;
            const targetY = rect.top + scrollTop - headerOffset;

            window.scrollTo({
                top: targetY,
                behavior: "smooth",
            });
        }, 0);

        return () => clearTimeout(t);
    }, [location.state]);

    return (
        <>
            <HeroSlider />
            <CategoryGrid />
            <AdvantagesSection />
            <ReviewsSection />
        </>
    );
};

export default HomePage;
