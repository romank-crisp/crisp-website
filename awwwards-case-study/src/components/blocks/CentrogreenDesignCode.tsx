"use client";

import { useRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lottie Assets
const lottieLettersPath = "/img/imgcases/centrogreen/centrogreen-letters.json";
const lottieTypographyPath = "/img/imgcases/centrogreen/centrogreeen-typography.json";

// Color Palette Data
const colors = [
    { name: "Light Green", hex: "9FDC7E", rgb: "159 220 126", color: "#9FDC7E", textBlack: false },
    { name: "Grass Green", hex: "5CA752", rgb: "92 167 82", color: "#5CA752", textBlack: false },
    { name: "Leaf Green", hex: "36893A", rgb: "54 137 58", color: "#36893A", textBlack: false },
    { name: "Deep Teal Green", hex: "005F43", rgb: "0 95 67", color: "#005F43", textBlack: false },
    { name: "Charcoal Green", hex: "151E15", rgb: "21 30 21", color: "#151E15", textBlack: false },
    { name: "Bright Yellow", hex: "FFF958", rgb: "255 249 88", color: "#FFF958", textBlack: true },
];

export function CentrogreenDesignCode() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Lottie Refs
    const lettersRef = useRef<LottieRefCurrentProps>(null);
    const typographyRef = useRef<LottieRefCurrentProps>(null);

    // Data State
    const [lettersData, setLettersData] = useState<unknown>(null);
    const [typographyData, setTypographyData] = useState<unknown>(null);

    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    // Fetch Lottie JSONs
    useEffect(() => {
        fetch(lottieLettersPath)
            .then(res => res.json())
            .then(data => setLettersData(data))
            .catch(err => console.error("Failed to load letters animation", err));

        fetch(lottieTypographyPath)
            .then(res => res.json())
            .then(data => setTypographyData(data))
            .catch(err => console.error("Failed to load typography animation", err));
    }, []);

    useGSAP(() => {
        if (!lettersData || !typographyData || !lettersRef.current || !typographyRef.current) return;

        // Helper to safely play animation
        const safePlay = (ref: any) => {
            if (ref.current) {
                // Force go to frame 0 and play
                ref.current.goToAndPlay(0, true);
            }
        };

        // Letters Trigger
        ScrollTrigger.create({
            trigger: row1Ref.current,
            start: "top 85%",
            onEnter: () => safePlay(lettersRef),
            onEnterBack: () => safePlay(lettersRef),
        });

        // Typography Trigger
        ScrollTrigger.create({
            trigger: row2Ref.current,
            start: "top 85%",
            onEnter: () => safePlay(typographyRef),
            onEnterBack: () => safePlay(typographyRef),
        });

        // Check if elements are already in view on load and play them
        // This handles cases where user refreshes the page while scrolled down
        setTimeout(() => {
            if (row1Ref.current && ScrollTrigger.isInViewport(row1Ref.current)) {
                safePlay(lettersRef);
            }
            if (row2Ref.current && ScrollTrigger.isInViewport(row2Ref.current)) {
                safePlay(typographyRef);
            }
            ScrollTrigger.refresh();
        }, 500);

    }, [lettersData, typographyData]);

    return (
        <section ref={containerRef} className="w-full bg-white py-24 md:py-32 flex justify-center">
            <div className="w-full max-w-[1475px] flex flex-col gap-8 md:gap-12">

                {/* 1. ROW 1: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">

                    {/* Left Block: Colors w/ Hover Interaction */}
                    <div className="flex flex-col h-[600px] w-full" onMouseLeave={() => setHoveredIndex(null)}>
                        {colors.map((color, index) => (
                            <div
                                key={color.hex}
                                onMouseEnter={() => setHoveredIndex(index)}
                                className={clsx(
                                    "relative flex items-center justify-between px-8 md:px-12 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer overflow-hidden",
                                    hoveredIndex === null
                                        ? "h-[16.66%]"
                                        : hoveredIndex === index
                                            ? "h-[45%]"
                                            : "h-[11%]"
                                )}
                                style={{ backgroundColor: color.color }}
                            >
                                <div className={clsx(
                                    "flex flex-col transition-opacity duration-300",
                                    color.textBlack ? "text-black" : "text-white"
                                )}>
                                    <span className="text-[14px] font-bold uppercase tracking-wider whitespace-nowrap">{color.name}</span>
                                    <span
                                        className={clsx(
                                            "text-[12px] opacity-60 lg:hidden font-mono uppercase mt-1 transition-opacity duration-300",
                                            hoveredIndex !== null && hoveredIndex !== index ? "opacity-0" : "opacity-60"
                                        )}
                                    >
                                        HEX: {color.hex}
                                    </span>
                                </div>
                                <div className={clsx(
                                    "text-right hidden lg:block transition-opacity duration-300",
                                    color.textBlack ? "text-black" : "text-white",
                                    hoveredIndex !== null && hoveredIndex !== index ? "opacity-0" : "opacity-100"
                                )}>
                                    <div className="text-[14px] font-bold uppercase tracking-wider">HEX: {color.hex}</div>
                                    <div className="text-[12px] opacity-60 uppercase font-mono mt-1">RGB: {color.rgb}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Block: Lottie Animation (Letters) */}
                    <div
                        ref={row1Ref}
                        className="w-full h-[600px] bg-[#043828] flex items-center justify-center p-12 cursor-pointer group"
                        onClick={() => lettersRef.current?.goToAndPlay(0)}
                    >
                        <div className="w-full h-full max-w-[80%] max-h-[80%] flex items-center justify-center transition-transform duration-500 group-active:scale-95">
                            {lettersData ? (
                                <Lottie
                                    lottieRef={lettersRef}
                                    animationData={lettersData}
                                    loop={false}
                                    autoplay={false}
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="text-white/20 animate-pulse text-sm">Loading...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. ROW 2: 1 Column (Typographic Lottie) */}
                <div
                    ref={row2Ref}
                    className="w-full bg-[#043828] p-8 md:p-16 lg:p-24 cursor-pointer group"
                    onClick={() => typographyRef.current?.goToAndPlay(0)}
                >
                    <div className="w-full relative aspect-[16/9] transition-transform duration-500 group-active:scale-[0.99]">
                        {typographyData ? (
                            <Lottie
                                lottieRef={typographyRef}
                                animationData={typographyData}
                                loop={false}
                                autoplay={false}
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-white/20 animate-pulse text-sm">Loading...</div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
