"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

interface ColorBlockProps {
    id: string;
    name: string;
    color: string;
    textColor: string;
    rgb: string;
    cmyk: string;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    className?: string;
}

function ColorBlock({
    id,
    name,
    color,
    textColor,
    rgb,
    cmyk,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    className
}: ColorBlockProps) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={clsx(
                "relative rounded-[24px] overflow-hidden flex flex-col justify-center items-center p-24 cursor-pointer transition-colors duration-500",
                className
            )}
            style={{ backgroundColor: color, color: textColor }}
        >
            <div className={clsx(
                "w-full h-full flex flex-col justify-center items-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isHovered ? "scale-[1.05]" : "scale-100"
            )}>
                {/* Standard small font, no caps */}
                <span className="font-text text-text-sm font-medium tracking-tight text-center pointer-events-none">
                    {name}
                </span>

                {/* Color Codes below text - ALWAYS VISIBLE */}
                <div className="flex flex-col gap-2 opacity-100">
                    <span className="font-text text-[10px] opacity-60 text-center uppercase tracking-widest leading-none">
                        RGB: {rgb}
                    </span>
                    <span className="font-text text-[10px] opacity-60 text-center uppercase tracking-widest leading-none">
                        CMYK: {cmyk}
                    </span>
                </div>
            </div>

            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50" />
        </div>
    );
}

export function TheyTalkDesignSystem() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Initial grid state (ratios)
    // Row ratios: 4:3:5 (total 12)
    // Col ratios: 8:4 (total 12)
    const baseRows = [4, 3, 5];
    const baseCols = [8, 4];

    // Subtle expansion logic (cell scale not more than 10%)
    const getGridTemplate = () => {
        let rows = [...baseRows];
        let cols = [...baseCols];

        if (!hoveredId) return {
            gridTemplateRows: rows.map(r => `${r}fr`).join(" "),
            gridTemplateColumns: cols.map(c => `${c}fr`).join(" ")
        };

        // If Primary (Span Row 0 & 1, Col 0)
        if (hoveredId === "primary") { rows[0] = 4.5; rows[1] = 3.5; rows[2] = 4; cols[0] = 8.8; cols[1] = 3.2; }
        if (hoveredId === "dark") { rows[0] = 5; rows[1] = 3; rows[2] = 4; cols[0] = 7.2; cols[1] = 4.8; }
        if (hoveredId === "light") { rows[0] = 4; rows[1] = 4; rows[2] = 4; cols[0] = 7.2; cols[1] = 4.8; }
        if (hoveredId === "yellow") { rows[0] = 3.5; rows[1] = 2.5; rows[2] = 6; cols[0] = 8.8; cols[1] = 3.2; }
        if (hoveredId === "black") { rows[0] = 3.5; rows[1] = 2.5; rows[2] = 6; cols[0] = 7.2; cols[1] = 4.8; }

        return {
            gridTemplateRows: rows.map(r => `${r}fr`).join(" "),
            gridTemplateColumns: cols.map(c => `${c}fr`).join(" ")
        };
    };

    const colors = [
        { id: "primary", name: "Primary Green", color: "#8BE700", textColor: "#000000", rgb: "139 231 0", cmyk: "40 0 100 9" },
        { id: "dark", name: "Green Dark", color: "#19A30E", textColor: "#000000", rgb: "25, 163, 14", cmyk: "85 0 91 36" },
        { id: "light", name: "Green Light", color: "#A6FE00", textColor: "#000000", rgb: "166 254 0", cmyk: "35 0 100 0" },
        { id: "yellow", name: "Accent Yellow", color: "#FFF204", textColor: "#000000", rgb: "255 242 4", cmyk: "0 5 98 0" },
        { id: "black", name: "Black", color: "#000000", textColor: "#FFFFFF", rgb: "0 0 0", cmyk: "0 0 0 100" },
    ];

    return (
        <section className="w-full py-32 md:py-64 flex justify-center bg-white overflow-hidden">
            <div className="w-full max-w-[1475px] px-16 md:px-0">
                <div
                    className="grid gap-16 md:gap-24 h-[600px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={getGridTemplate()}
                >
                    <ColorBlock
                        {...colors[0]}
                        isHovered={hoveredId === "primary"}
                        onMouseEnter={() => setHoveredId("primary")}
                        onMouseLeave={() => setHoveredId(null)}
                        className="col-start-1 col-end-2 row-start-1 row-end-3"
                    />
                    <ColorBlock
                        {...colors[1]}
                        isHovered={hoveredId === "dark"}
                        onMouseEnter={() => setHoveredId("dark")}
                        onMouseLeave={() => setHoveredId(null)}
                        className="col-start-2 col-end-3 row-start-1 row-end-2"
                    />
                    <ColorBlock
                        {...colors[2]}
                        isHovered={hoveredId === "light"}
                        onMouseEnter={() => setHoveredId("light")}
                        onMouseLeave={() => setHoveredId(null)}
                        className="col-start-2 col-end-3 row-start-2 row-end-3"
                    />
                    <ColorBlock
                        {...colors[3]}
                        isHovered={hoveredId === "yellow"}
                        onMouseEnter={() => setHoveredId("yellow")}
                        onMouseLeave={() => setHoveredId(null)}
                        className="col-start-1 col-end-2 row-start-3 row-end-4"
                    />
                    <ColorBlock
                        {...colors[4]}
                        isHovered={hoveredId === "black"}
                        onMouseEnter={() => setHoveredId("black")}
                        onMouseLeave={() => setHoveredId(null)}
                        className="col-start-2 col-end-3 row-start-3 row-end-4"
                    />
                </div>
            </div>
        </section>
    );
}
