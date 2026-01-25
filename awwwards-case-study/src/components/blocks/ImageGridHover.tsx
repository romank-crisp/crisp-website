"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

interface ImageGridHoverProps {
    heroSrc: string;
    gridSrcs: string[]; // Exactly 4 images
    alt?: string;
}

export function ImageGridHover({ heroSrc, gridSrcs, alt = "Interactive Image Block" }: ImageGridHoverProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current || !heroRef.current) return;

        const tl = gsap.timeline({ paused: true });

        // Hero image fades out and downscales
        tl.to(heroRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.inOut",
        }, 0);

        // Grid images emerge from center
        // Grid images (Z-20, on top) emerge
        gridRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const xStart = index % 2 === 0 ? 15 : -15;
            const yStart = index < 2 ? 15 : -15;

            // Row stagger: Top row (0,1) starts at 0, Bottom row (2,3) starts at 0.05
            const delay = index < 2 ? 0 : 0.05;

            tl.fromTo(ref,
                {
                    scale: 0.95,
                    x: xStart,
                    y: yStart,
                    opacity: 0
                },
                {
                    scale: 1,
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                },
                delay
            );
        });

        const handleMouseEnter = () => tl.play();
        const handleMouseLeave = () => tl.reverse();

        containerRef.current.addEventListener("mouseenter", handleMouseEnter);
        containerRef.current.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            containerRef.current?.removeEventListener("mouseenter", handleMouseEnter);
            containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video overflow-hidden group cursor-pointer bg-white"
        >
            {/* Grid Images (Foreground z-20) */}
            <div className="absolute inset-0 z-20 grid grid-cols-2 grid-rows-2 gap-16">
                {gridSrcs.slice(0, 4).map((src, i) => (
                    <div
                        key={i}
                        ref={(el) => { gridRefs.current[i] = el; }}
                        className="relative w-full h-full overflow-hidden opacity-0"
                        style={{
                            transformOrigin: i === 0 ? "bottom right" :
                                i === 1 ? "bottom left" :
                                    i === 2 ? "top right" : "top left"
                        }}
                    >
                        <Image
                            src={src}
                            alt={`${alt} grid ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 50vw"
                        />
                    </div>
                ))}
            </div>

            {/* Hero Image (Background z-10) */}
            <div
                ref={heroRef}
                className="absolute inset-0 z-10"
            >
                <Image
                    src={heroSrc}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
            </div>
        </div>
    );
}
