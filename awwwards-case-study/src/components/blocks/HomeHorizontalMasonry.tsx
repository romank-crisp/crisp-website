"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAssetUrl } from '@/lib/utils';
import { useGSAP } from "@gsap/react";
import { twMerge } from "tailwind-merge";
import Spline from "@splinetool/react-spline";
import { clsx, type ClassValue } from "clsx";
import { HomeAnimatedText } from "./HomeAnimatedText";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function HomeLottieBottom({ src }: { src: string }) {
    const [animationData, setAnimationData] = useState<unknown>(null);

    useEffect(() => {
        const url = getAssetUrl(src);
        fetch(url)
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error("Failed to load Lottie:", err));
    }, [src]);

    if (!animationData) return null;

    return (
        <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ display: "block" }}
        />
    );
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
            // Override col4 width to match col3 (40vw)
            width: colIdx === 3 ? "40vw" : col.width,
            cells: col.cells.map((cell, cellIdx) => {
                // 3rd column (index 2), bottom block (index 1) -> Team Video
                if (colIdx === 2 && cellIdx === 1) {
                    return {
                        ...cell,
                        content: (
                            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit]">
                                <video
                                    src="https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/team.webm"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )
                    };
                }

                // 4th column (index 3), upper block (index 0) -> Spline Scene
                if (colIdx === 3 && cellIdx === 0) {
                    return {
                        ...cell,
                        height: "40vw",
                        className: cn(cell.className, "bg-white overflow-hidden"),
                        content: (
                            <div className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing [&>div]:!h-full [&>div]:!w-full [&>div>canvas]:!w-full [&>div>canvas]:!h-full [&>div>canvas]:object-cover">
                                <Spline scene="/spline/scene.splinecode" />
                            </div>
                        )
                    };
                }

                // 4col (column index 3), bottom block (index 1) -> Lottie pinned to bottom edge
                if (colIdx === 3 && cellIdx === 1) {
                    return {
                        ...cell,
                        height: "50%",
                        className: cn(cell.className, "overflow-hidden p-0 !scale-100"),
                        content: (
                            <div className="absolute inset-0 w-full h-full pointer-events-none flex items-end justify-center">
                                <HomeLottieBottom src="/img/home-hero/home-hero-05.json" />
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
    // Filter content - assume first cell of first column is the header
    const heroCell = columns[0]?.cells[0];

    // Get all other cells for the slider
    const mediaCells = columns.flatMap(col => col.cells).filter(cell => cell !== heroCell);

    return (
        <div className="w-full overflow-hidden bg-white py-12 relative mt-[100px] md:mt-48 px-16 md:px-0">
            {/* 1. Header (Static) */}
            {heroCell && (
                <div className="mb-16">
                    {heroCell.content}
                </div>
            )}

            {/* 2. Scrollable Slider (Media) */}
            <div className="w-full -mx-16 px-16 overflow-x-auto snap-x snap-mandatory flex gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ width: 'calc(100% + 32px)' }}>
                {mediaCells.map((cell) => (
                    <div
                        key={cell.id}
                        className={cn(
                            "relative border border-black/10 rounded-lg overflow-hidden shrink-0 snap-center",
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
    );
}
