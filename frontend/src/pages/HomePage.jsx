// src/pages/HomePage.jsx
import React from "react";
import HeroSlider from "../components/home/HeroSlider.jsx";
import CategoryGrid from "../components/home/CategoryGrid.jsx";
import Advantages from "../components/home/Advantages.jsx";
import ReviewsSection from "../components/home/ReviewsSection.jsx";

const HomePage = () => {
    return (
        <>
            <HeroSlider />
            <CategoryGrid />
            <Advantages />
            <ReviewsSection />
        </>
    );
};

export default HomePage;
