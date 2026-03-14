"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AIVisualImageComparisonProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
    aspectRatio?: "video" | "square" | "portrait" | "auto";
}

export function AIVisualImageComparison({
    beforeImage,
    afterImage,
    className,
    aspectRatio = "video"
}: AIVisualImageComparisonProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate position percentage horizontally
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;

        setSliderPosition(percent);
        setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setSliderPosition(50); // Reset to middle on leave
    };

    const aspectClasses = {
        video: "aspect-video",
        square: "aspect-square",
        portrait: "aspect-[3/4]",
        auto: "h-[60vh] md:h-[80vh]",
    };

    return (
        <section className={clsx("w-full bg-white relative py-24", className)}>
            <div className="max-w-[1475px] mx-auto px-6 md:px-16 w-full">
                <div
                    ref={containerRef}
                    className={clsx(
                        "relative w-full overflow-hidden rounded-[24px] cursor-none group",
                        aspectClasses[aspectRatio]
                    )}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* After Image (Background) */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={afterImage}
                            alt="After Edit"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1475px) 100vw, 1475px"
                        />
                    </div>

                    {/* Before Image (Foreground, clipped) */}
                    <div
                        className="absolute inset-0 w-full h-full will-change-[clip-path]"
                        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    >
                        <Image
                            src={beforeImage}
                            alt="Before Edit"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1475px) 100vw, 1475px"
                        />
                    </div>

                    {/* Custom Trailing Cursor / Arrows */}
                    <div
                        className={clsx(
                            "absolute top-0 left-0 pointer-events-none flex items-center justify-center transition-opacity duration-300",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                            transform: `translate(${cursorPos.x - 32}px, ${cursorPos.y - 32}px)`,
                            width: 64,
                            height: 64
                        }}
                    >
                        <div className="flex bg-white/10 backdrop-blur-md rounded-full shadow-lg p-2 gap-1 border border-white/20 text-white mix-blend-difference">
                            <ChevronLeft className="w-5 h-5" />
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Default Slider Line */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none mix-blend-difference z-10"
                        style={{ left: `${sliderPosition}%` }}
                    ></div>
                </div>
            </div>
        </section>
    );
}
