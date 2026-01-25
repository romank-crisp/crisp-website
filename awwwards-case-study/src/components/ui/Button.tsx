"use client";

import { clsx } from "clsx";
import Link from "next/link";
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "filled" | "outline" | "transparent";
    size?: "small" | "medium" | "large";
    href?: string;
    className?: string;
    onClick?: () => void;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
}

const Icon = ({ size = 32 }: { size?: number }) => (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect
            x={size * 0.1875}
            y={size * 0.375}
            width={size * 0.625}
            height={size * 0.0625}
            fill="currentColor"
        />
        <rect
            x={size * 0.1875}
            y={size * 0.5625}
            width={size * 0.625}
            height={size * 0.0625}
            fill="currentColor"
        />
    </svg>
);

export function Button({
    children,
    variant = "filled",
    size = "medium",
    href,
    className,
    onClick,
    showLeftIcon = true,
    showRightIcon = true,
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-8 rounded-full font-heading font-bold transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap overflow-hidden";

    const variants = {
        filled: "bg-brand text-white border-2 border-brand hover:brightness-110",
        outline: "bg-transparent text-text border-2 border-text hover:bg-text/5",
        transparent: "bg-transparent text-text hover:bg-text/5",
    };

    const sizes = {
        small: "h-[42px] px-16 text-h4",
        medium: "h-[50px] px-16 text-h3",
        large: "h-[70px] px-16 text-h3",
    };

    const iconSize = size === "small" ? 24 : 32;

    const content = (
        <>
            {showLeftIcon && <Icon size={iconSize} />}
            <span className="inline-flex items-center gap-12 leading-none">{children}</span>
            {showRightIcon && <Icon size={iconSize} />}
        </>
    );

    const combinedClassName = clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        size === "small" && (variant === "filled" || variant === "outline") && "mt-[2px]",
        className
    );

    if (href) {
        return (
            <Link href={href} className={combinedClassName}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClassName}>
            {content}
        </button>
    );
}
