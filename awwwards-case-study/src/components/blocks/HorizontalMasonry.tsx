"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function HorizontalMasonry({ columns, className }: HorizontalMasonryProps) {
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

        // 0. Initial Entry Animation (Peek/Bounce)
        // We only play this if the section is at the top of the viewport
        const isAtTop = window.scrollY < (containerRef.current?.offsetTop || 0) + 10;

        if (isAtTop) {
            gsap.from(trackRef.current, {
                x: 100,
                duration: 1.4,
                delay: 0.5,
                ease: "back.out(1.5)",
                overwrite: "auto"
            });
        }

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
                immediateRender: false, // Prevents snapping to x:0 before intro runs
            }
        });

        // 2. Cell Reveals using containerAnimation
        const cells = trackRef.current.querySelectorAll(".masonry-cell");
        cells.forEach((cell) => {
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

    }, { scope: containerRef, dependencies: [columns, scrollDistancePx] });

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
            style={{ height: scrollHeight ? `${scrollHeight}px` : "100vh" }}
        >
            {/* Sticky Container - This mimics "pinning" using native CSS */}
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full overflow-hidden bg-white"
            >
                <div
                    ref={trackRef}
                    className="flex h-full items-stretch will-change-transform"
                    style={{ width: "fit-content" }}
                >
                    {columns.map((col) => (
                        <div
                            key={col.id}
                            className="flex flex-col h-full shrink-0 relative"
                            style={{ width: col.width }}
                        >
                            {col.cells.map((cell) => (
                                <div
                                    key={cell.id}
                                    className={cn(
                                        "masonry-cell relative w-full flex flex-col justify-center overflow-hidden",
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
        </div>
    );
}
