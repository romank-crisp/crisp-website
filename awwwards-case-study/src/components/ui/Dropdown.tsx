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
    sizeVariant?: "small" | "medium" | "large";
    className?: string;
    onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
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
    onFocus,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

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

    // Reset highlighted index when opening/closing
    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0);
        } else {
            setHighlightedIndex(-1);
        }
    }, [isOpen]);

    const handleSelect = (val: string) => {
        onChange?.(val);
        setIsOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    handleSelect(options[highlightedIndex].value);
                }
                break;
            case "Escape":
            case "Tab":
                setIsOpen(false);
                break;
        }
    };

    const baseStyles = "w-full bg-slate-100 flex items-center justify-between cursor-pointer transition-all duration-300 font-heading";

    const variants = {
        default: "hover:bg-slate-200 text-text",
        error: "bg-red-50 text-brand",
    };

    const sizes = {
        small: "h-[42px] text-h4 px-12 py-12 rounded-[var(--corner-small)]",
        medium: "h-[50px] text-h4 px-16 py-12 rounded-[var(--corner-small)]",
        large: "h-[70px] text-h3 px-16 py-12 rounded-[var(--corner-small)]",
    };

    return (
        <div ref={dropdownRef} className={clsx("relative flex flex-col gap-8", className)}>
            <div
                className={clsx(baseStyles, variants[variant], sizes[sizeVariant], "focus:ring-2 focus:ring-brand/20 outline-none")}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                onFocus={(e) => {
                    setIsOpen(true);
                    onFocus?.(e);
                }}
                onKeyDown={onKeyDown}
            >
                <span className={clsx(!selectedOption && "opacity-60")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={clsx("w-16 h-16 transition-transform duration-300 opacity-50", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div
                    ref={listRef}
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-text/5 shadow-2xl rounded-xl z-50 p-8 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <div className="flex flex-col">
                        {options.map((option, index) => (
                            <div
                                key={option.value}
                                className={clsx(
                                    "pl-8 pr-16 py-12 text-left transition-all cursor-pointer hover:bg-text/[0.03]",
                                    sizeVariant === "large" ? "text-h3" : "text-h4",
                                    index !== options.length - 1 && "border-b border-text/5",
                                    value === option.value || highlightedIndex === index ? "text-brand bg-text/[0.02]" : "text-text"
                                )}
                                onClick={() => handleSelect(option.value)}
                                onMouseEnter={() => setHighlightedIndex(index)}
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
