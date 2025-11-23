// src/components/common/Container.jsx
import React from "react";

const Container = ({ children, className = "" }) => {
    return <div className={`app-container ${className}`}>{children}</div>;
};

export default Container;
