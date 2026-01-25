"use client";

import { clsx } from "clsx";
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "error";
    sizeVariant?: "small" | "medium";
    label?: string;
}

export function Input({
    variant = "default",
    sizeVariant = "small",
    label,
    className,
    ...props
}: InputProps) {
    const baseStyles = "w-full border-b border-text/20 focus:border-text transition-all duration-300 outline-none bg-transparent font-heading";

    const variants = {
        default: "border-text/20 focus:border-text",
        error: "border-brand text-brand placeholder:text-brand/50",
    };

    const sizes = {
        small: "h-[42px] text-h4 pl-4 pr-12 py-12",
        medium: "h-[50px] text-h3 pl-8 pr-16 py-12",
    };

    return (
        <div className={clsx("relative flex flex-col gap-12", className)}>
            <input
                className={clsx(baseStyles, variants[variant], sizes[sizeVariant])}
                aria-label={label}
                {...props}
            />
            {variant === "error" && props.title && (
                <span className="text-[10px] text-brand uppercase font-bold tracking-tight mt-4">
                    {props.title}
                </span>
            )}
        </div>
    );
}
