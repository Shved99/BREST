// src/components/common/Container.jsx
import React from "react";

const Container = ({ children, className = "", style }) => {
    return (
        <div className={`app-container ${className}`} style={style}>
            {children}
        </div>
    );
};

export default Container;
