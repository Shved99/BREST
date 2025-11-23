// src/components/common/Button.jsx
import React from "react";

const Button = ({ children, variant = "primary", className = "", ...rest }) => {
    const base = "btn";
    const typeClass = variant === "outline" ? "btn-outline" : "btn-primary";

    return (
        <button className={`${base} ${typeClass} ${className}`} {...rest}>
            {children}
        </button>
    );
};

export default Button;
