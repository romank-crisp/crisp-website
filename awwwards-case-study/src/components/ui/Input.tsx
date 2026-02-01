"use client";

import { clsx } from "clsx";
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "error";
    sizeVariant?: "small" | "medium" | "large";
    label?: string;
}

export function Input({
    variant = "default",
    sizeVariant = "small",
    label,
    className,
    ...props
}: InputProps) {
    const baseStyles = "w-full bg-slate-100 transition-all duration-300 outline-none font-heading placeholder:opacity-60";

    const variants = {
        default: "focus:bg-slate-200",
        error: "bg-red-50 text-brand placeholder:text-brand/60",
    };

    const sizes = {
        small: "h-[42px] text-h4 px-12 py-12 rounded-[var(--corner-small)]",
        medium: "h-[50px] text-h4 px-16 py-12 rounded-[var(--corner-small)]",
        large: "h-[70px] text-h3 px-16 py-12 rounded-[var(--corner-small)]",
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
