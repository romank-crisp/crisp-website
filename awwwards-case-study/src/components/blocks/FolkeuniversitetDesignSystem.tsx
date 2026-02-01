"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface ColorCircleProps {
    color: string;
    label: string;
    sublabel?: string;
    code?: string;
    isStroked?: boolean;
    onHover?: (color: string | null) => void;
}

function ColorCircle({ color, label, sublabel, code, isStroked, onHover }: ColorCircleProps) {
    return (
        <div
            className="flex flex-col items-center gap-6 cursor-pointer group p-48 md:p-64 rounded-48 transition-all duration-300 hover:bg-[#EBEBEF]"
            onMouseEnter={() => onHover?.(color)}
            onMouseLeave={() => onHover?.(null)}
        >
            <div
                className={clsx(
                    "w-48 h-48 md:w-64 md:h-64 rounded-full transition-transform duration-300 group-hover:scale-105",
                    isStroked && "border border-black/10"
                )}
                style={{ backgroundColor: color }}
            />
            <div className="text-center font-heading text-xs md:text-sm font-bold uppercase tracking-wider text-text flex flex-col gap-1 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                <p>{label}</p>
                {sublabel && <p>{sublabel}</p>}
                {code && <p className="text-text/50 font-medium normal-case">{code}</p>}
            </div>
        </div>
    );
}

export function FolkeuniversitetDesignSystem() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
    const [activeColor, setActiveColor] = useState<string>("#FF3F2E"); // Default primary red

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            // Center of the eyes area (roughly center of the container)
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2; // Approximate center relative to bounding box

            // Adjust center Y because eyes are higher up now
            // We moved eyes up by ~70px.
            // Let's just track relative to the container center for simplicity of movement vector

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Limit movement
            const maxMove = 12;
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 15, maxMove);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            setPupilPos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Unified list of colors for the 5-item row
    const allColors = [
        { color: "#FF3F2E", label: "Primary", sublabel: "Red", code: "RGB 255 63 46" },
        { color: "#FFD8D0", label: "Accent", sublabel: "Light", code: "RGB 255 216 208" },
        { color: "#C6002A", label: "Accent", sublabel: "Norsk Red", code: "RGB 198 0 42" },
        { color: "#00205B", label: "Accent", sublabel: "Norsk Blue", code: "RGB 0 32 91" },
    ];

    const handleHover = (color: string | null) => {
        setActiveColor(color || "#FF3F2E");
    };

    return (
        <section className="w-full py-32 md:py-64 bg-white flex justify-center items-center overflow-hidden">
            <div
                className="w-full max-w-[1475px] px-16 flex flex-col md:flex-row items-center justify-between gap-32 md:gap-0"
                style={{ transform: 'translateY(-25px)' }}
            >
                {/* Discrete items for equal spacing */}
                <div className="flex-1 flex justify-center md:justify-start order-2 md:order-1">
                    <ColorCircle {...allColors[0]} onHover={handleHover} />
                </div>
                <div className="flex-1 flex justify-center md:justify-center order-2 md:order-1">
                    <ColorCircle {...allColors[1]} onHover={handleHover} />
                </div>

                {/* Center Owl (Fixed Width) */}
                <div
                    ref={containerRef}
                    className="relative w-[280px] md:w-[480px] aspect-square flex items-center justify-center order-1 md:order-2 shrink-0"
                >
                    <div className="relative w-full h-full">
                        {/* Using mask to recolor the SVG */}
                        <div
                            className="w-full h-full transition-colors duration-500 ease-out"
                            style={{
                                backgroundColor: activeColor,
                                maskImage: 'url(/img/imgcases/folkeuniversitetet/fu-owl.svg)',
                                maskSize: 'contain',
                                maskPosition: 'center',
                                maskRepeat: 'no-repeat',
                                WebkitMaskImage: 'url(/img/imgcases/folkeuniversitetet/fu-owl.svg)',
                                WebkitMaskSize: 'contain',
                                WebkitMaskPosition: 'center',
                                WebkitMaskRepeat: 'no-repeat'
                            }}
                        />
                    </div>

                    {/* Eyes overlay */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 flex w-[42%] h-[25%] pointer-events-none justify-center"
                        style={{
                            top: 'calc(34% - 50px)',
                            gap: 'calc(22% + 40px)'
                        }}
                    >
                        <div className="relative w-[35%] h-[90%] flex items-center justify-center">
                            <div
                                className="w-[35px] h-[35px] md:w-[70px] md:h-[70px] rounded-full transition-all duration-500 ease-out"
                                style={{
                                    transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                                    backgroundColor: activeColor
                                }}
                            />
                        </div>
                        <div className="relative w-[35%] h-[90%] flex items-center justify-center">
                            <div
                                className="w-[35px] h-[35px] md:w-[70px] md:h-[70px] rounded-full transition-all duration-500 ease-out"
                                style={{
                                    transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                                    backgroundColor: activeColor
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center md:justify-center order-3">
                    <ColorCircle {...allColors[2]} onHover={handleHover} />
                </div>
                <div className="flex-1 flex justify-center md:justify-end order-3">
                    <ColorCircle {...allColors[3]} onHover={handleHover} />
                </div>
            </div>
        </section>
    );
}
