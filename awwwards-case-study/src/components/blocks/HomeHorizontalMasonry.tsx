"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAssetUrl } from '@/lib/utils';
import { useGSAP } from "@gsap/react";
import { twMerge } from "tailwind-merge";
import Spline from "@splinetool/react-spline";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type MasonryCell = {
    id: string;
    height: string;
    className?: string;
    content?: React.ReactNode;
};

export type MasonryColumn = {
    id: string;
    width: string;
    cells: MasonryCell[];
};

interface HorizontalMasonryProps {
    columns: MasonryColumn[];
    className?: string;
}



export function HomeHorizontalMasonry({ columns: initialColumns, className }: HorizontalMasonryProps) {
    // Inject interactive & video components into specific grid cells
    const columns = useMemo(() => {
        return initialColumns.map((col, colIdx) => ({
            ...col,
            cells: col.cells.map((cell, cellIdx) => {
                // 3rd row (column index 2), bottom block (index 1) -> Spline Scene
                if (colIdx === 2 && cellIdx === 1) {
                    return {
                        ...cell,
                        content: (
                            <div className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing [&>div]:!h-full [&>div]:!w-full [&>div>canvas]:!w-full [&>div>canvas]:!h-full [&>div>canvas]:object-cover">
                                <Spline scene="/spline/scene.splinecode" />
                            </div>
                        )
                    };
                }



                return cell;
            })
        }));
    }, [initialColumns]);

    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [dim, setDim] = useState({ width: 0, height: 0 });

    // Handle resize and initial dimensions
    useEffect(() => {
        const update = () => {
            setDim({ width: window.innerWidth, height: window.innerHeight });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const totalVw = columns.reduce((acc, col) => acc + (parseFloat(col.width) || 0), 0);
    const scrollDistancePx = dim.width ? ((totalVw - 100) / 100) * dim.width : 0;
    const scrollHeight = dim.height + scrollDistancePx;

    useGSAP(() => {
        if (!containerRef.current || !trackRef.current || !stickyRef.current || scrollDistancePx <= 0) return;

        gsap.registerPlugin(ScrollTrigger);

        const mm = gsap.matchMedia();

        // Desktop only animations (min-width: 768px)
        mm.add("(min-width: 768px)", () => {


            // 1. Horizontal Translation
            const scrollTween = gsap.to(trackRef.current, {
                x: -scrollDistancePx,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    invalidateOnRefresh: true,
                    immediateRender: false,
                }
            });

            // 2. Cell Reveals using containerAnimation
            const cells = trackRef.current?.querySelectorAll(".masonry-cell");
            cells?.forEach((cell) => {
                gsap.fromTo(cell,
                    { opacity: 0, y: 40, scale: 0.98 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: cell,
                            containerAnimation: scrollTween,
                            start: "left 95%",
                            end: "left 60%",
                            scrub: true,
                        }
                    }
                );
            });
        });

        // Mobile cleanup/reset (max-width: 767px)
        mm.add("(max-width: 767px)", () => {
            const cells = trackRef.current?.querySelectorAll(".masonry-cell");
            if (cells) {
                gsap.set(cells, { opacity: 1, y: 0, scale: 1, clearProps: "all" });
            }
            if (trackRef.current) {
                gsap.set(trackRef.current, { x: 0, clearProps: "all" });
            }
        });

    }, { scope: containerRef, dependencies: [columns, scrollDistancePx] });

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
            style={{
                // Only apply height on desktop (md breakpoint is 768px)
                height: dim.width >= 768 && scrollHeight ? `${scrollHeight}px` : "auto"
            }}
        >
            {/* Desktop: Sticky Container */}
            {dim.width >= 768 ? (
                <div
                    ref={stickyRef}
                    className="relative h-screen w-full overflow-hidden bg-white sticky top-0"
                >
                    <div
                        ref={trackRef}
                        className="flex flex-row h-full w-fit items-stretch will-change-transform"
                    >
                        {columns.map((col, colIdx) => (
                            <div
                                key={col.id}
                                className={cn(
                                    "flex flex-col h-full shrink-0 relative",
                                    colIdx > 0 && "-ml-[0.5px]" // overlap columns visually to prevent 1px gap
                                )}
                                style={{ width: col.width }}
                            >
                                {col.cells.map((cell) => (
                                    <div
                                        key={cell.id}
                                        className={cn(
                                            "masonry-cell relative w-full flex flex-col justify-center overflow-hidden",
                                            "scale-[1.005] -mb-[0.5px]", // minor scaling / margin to hide inner gap rounding
                                            cell.className
                                        )}
                                        style={{ height: cell.height }}
                                    >
                                        {cell.content}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Mobile: Header + GSAP Infinite Slider */
                <MobileMasonryLayout columns={columns} />
            )}
        </div>
    );
}

// Sub-component for Mobile Layout to keep things clean
function MobileMasonryLayout({ columns }: { columns: MasonryColumn[] }) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    // Filter content - assume first cell of first column is the header
    const heroCell = columns[0]?.cells[0];

    // Get all other cells for the slider
    const mediaCells = columns.flatMap(col => col.cells).filter(cell => cell !== heroCell);

    useGSAP(() => {
        if (!sliderRef.current || !sliderContainerRef.current) return;

        const slider = sliderRef.current;
        // Clone for seamless loop
        const content = slider.innerHTML;
        slider.innerHTML += content;

        const totalWidth = slider.scrollWidth / 2;

        gsap.to(slider, {
            x: -totalWidth,
            duration: 20,
            ease: "none",
            repeat: -1,
        });

    }, { scope: sliderContainerRef });

    return (
        <div className="w-full overflow-hidden bg-white py-12 relative mt-[100px] md:mt-48 px-16 md:px-0">
            {/* 
                NOTE: Global padding 'px-4' is on body. 
                Full width slider needs -mx-4 to touch edges if desired, or just stay inside.
                Prompt said "Global: add L/R padding 16 px". 
                If slider should be full edge-to-edge on mobile, we need negative margin.
                "Slider with media should be placed below mega h1 header".
            */}

            {/* 1. Header (Static) */}
            {heroCell && (
                <div className="mb-16">
                    {heroCell.content}
                </div>
            )}

            {/* 2. GSAP Slider (Media) */}
            <div ref={sliderContainerRef} className="w-full overflow-hidden">
                <div ref={sliderRef} className="flex gap-4 w-max">
                    {mediaCells.map((cell) => (
                        <div
                            key={cell.id}
                            className={cn(
                                "relative border border-black/10 rounded-lg overflow-hidden shrink-0",
                                cell.className
                            )}
                            style={{
                                width: "80vw",
                                height: "50vh"
                            }}
                        >
                            {cell.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
