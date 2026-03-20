"use client";

import { clsx } from "clsx";
import Link from "next/link";
import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "filled" | "outline" | "transparent";
    size?: "small" | "medium" | "large";
    href?: string;
    className?: string;
    onClick?: () => void;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export function Button({
    children,
    variant = "filled",
    size = "medium",
    href,
    className,
    onClick,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    disabled = false,
    type = "button",
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-8 rounded-full font-heading font-bold transition-all duration-300 whitespace-nowrap overflow-hidden";

    const activeStyles = !disabled ? "hover:scale-105 active:scale-95 cursor-pointer" : "cursor-not-allowed opacity-50 grayscale";

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

    const iconSize = size === "small" ? 18 : 24;

    const content = (
        <>
            {LeftIcon && <LeftIcon size={iconSize} className="shrink-0" />}
            <span className="inline-flex items-center gap-12 leading-none">{children}</span>
            {RightIcon && <RightIcon size={iconSize} className="shrink-0" />}
        </>
    );

    const combinedClassName = clsx(
        baseStyles,
        activeStyles,
        variants[variant],
        sizes[size],
        size === "small" && (variant === "filled" || variant === "outline") && "mt-[2px]",
        className
    );

    if (href && !disabled) {
        return (
            <Link href={href} className={combinedClassName}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={!disabled ? onClick : undefined}
            className={combinedClassName}
            disabled={disabled}
        >
            {content}
        </button>
    );
}
