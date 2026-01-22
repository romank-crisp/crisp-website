"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealImageProps {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: string;
}

export function ScrollRevealImage({ src, alt, className, aspectRatio = "aspect-[16/9]" }: ScrollRevealImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !imgRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });

        tl.fromTo(containerRef.current,
            { clipPath: "inset(100% 0 0 0)" },
            {
                clipPath: "inset(0% 0 0 0)",
                duration: 1.2,
                ease: "power2.inOut",
                overwrite: "auto"
            }
        ).fromTo(imgRef.current,
            { scale: 1.15 },
            {
                scale: 1,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            },
            0 // Start at same time as parent tween
        );
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className={clsx("relative w-full overflow-hidden bg-gray-100 will-change-[clip-path]", aspectRatio, className)}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="w-full h-full object-cover will-change-transform"
            />
        </div>
    );
}
