"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";

interface TabItem {
    label: string;
    value: string;
}

interface TabsProps {
    items: TabItem[];
    activeValue: string;
    onChange: (value: string) => void;
    className?: string;
}

export function Tabs({ items, activeValue, onChange, className }: TabsProps) {
    return (
        <div className={clsx("inline-flex items-center bg-gray-100 p-4 rounded-full", className)}>
            {items.map((item) => {
                const isActive = activeValue === item.value;
                return (
                    <button
                        key={item.value}
                        onClick={() => onChange(item.value)}
                        className={clsx(
                            "relative px-24 py-12 rounded-full text-h4 font-heading font-bold transition-colors duration-200 z-10",
                            isActive ? "text-black" : "text-gray-500 hover:text-black/70"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white shadow-sm rounded-full z-[-1]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
