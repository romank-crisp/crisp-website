"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    options: { label: string; value: string }[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    variant?: "default" | "error";
    sizeVariant?: "small" | "medium";
    className?: string;
}

export function Dropdown({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    label,
    variant = "default",
    sizeVariant = "small",
    className,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const baseStyles = "w-full border-b flex items-center justify-between cursor-pointer transition-all duration-300 font-heading";

    const variants = {
        default: "border-text/20 hover:bg-text/[0.02] text-text",
        error: "border-brand text-brand",
    };

    const sizes = {
        small: "h-[42px] text-text-sm px-4 py-12",
        medium: "h-[50px] text-text-md px-8 py-12",
    };

    return (
        <div ref={dropdownRef} className={clsx("relative flex flex-col gap-8", className)}>
            <div
                className={clsx(baseStyles, variants[variant], sizes[sizeVariant])}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={clsx(!selectedOption && "opacity-50")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={clsx("w-16 h-16 transition-transform duration-300 opacity-50", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-text/5 shadow-2xl rounded-xl z-50 p-8 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col">
                        {options.map((option, index) => (
                            <div
                                key={option.value}
                                className={clsx(
                                    "pl-8 pr-16 py-12 text-left transition-all cursor-pointer hover:bg-text/[0.03]",
                                    sizeVariant === "medium" ? "text-h3" : "text-h4",
                                    index !== options.length - 1 && "border-b border-text/5",
                                    value === option.value ? "text-brand font-bold" : "text-text"
                                )}
                                onClick={() => {
                                    onChange?.(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
