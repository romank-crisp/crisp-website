"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { SlideData } from "./slides";

interface SlideRendererProps {
    slide: SlideData;
    scrollProgress: number; // 0 to 1
    trackRef: React.RefObject<HTMLDivElement>;
}

export function SlideRenderer({ slide, scrollProgress, trackRef }: SlideRendererProps) {
    const slideRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    // Subtle parallax and scale effect based on viewport position would act here
    // However, purely scroll-driven parallax inside a horizontal pinned section 
    // is often cleaner handled by parent ScrollTrigger or by checking .getBoundingClientRect()
    // inside a useFrame/ticker if we want continuous "active" detection.

    // For now, we render the structure. The "progressive reveal" logic mentioned 
    // (opacity 0.6 -> 1, scale 0.98 -> 1) is best handled by checking distance to center.
    // We can do a simple check here if we wanted, or trust GSAP in the parent.
    // Given requirements, let's add a simple GSAP ticker or effect here to monitor self.

    useEffect(() => {
        const el = slideRef.current;
        if (!el) return;

        const updateState = () => {
            const rect = el.getBoundingClientRect();
            const viewportCenter = window.innerWidth / 2;
            const elementCenter = rect.left + rect.width / 2;

            // Calculate distance from center normalized by viewport width
            const dist = Math.abs(viewportCenter - elementCenter);
            const maxDist = window.innerWidth / 1.5; // range of effect

            // Calculate interpolation factor (0 = center, 1 = far)
            let progress = Math.min(dist / maxDist, 1);

            // Invert for "active" state (1 = center, 0 = far)
            const active = 1 - progress;

            // Apply styles
            // Opacity: 0.3 -> 1
            const opacity = 0.3 + (0.7 * active);
            // Scale: 0.9 -> 1
            const scale = 0.9 + (0.1 * active);

            gsap.set(el, {
                opacity: opacity,
                scale: scale,
                overwrite: 'auto' // ensure we don't fight other tweens if any
            });

            // Parallax for inner content (subtle shift)
            if (innerRef.current) {
                // Shift x slightly based on position relative to center
                // negative on left, positive on right
                const parallaxX = (elementCenter - viewportCenter) * 0.1;
                gsap.set(innerRef.current, {
                    x: parallaxX
                });
            }
        };

        // Add listener
        const ticker = gsap.ticker.add(updateState);

        // Initial call
        updateState();

        return () => {
            gsap.ticker.remove(updateState);
        };
    }, []);

    const content = () => {
        switch (slide.type) {
            case 'text':
                return (
                    <div ref={innerRef} className="flex flex-col items-start gap-6 p-8">
                        {/* Tags removed as per request */}
                        <p className="font-text text-text-lg leading-relaxed text-black transition-colors duration-300 group cursor-pointer">
                            {slide.content}
                            <span className="inline-block w-4 h-4 bg-brand rounded-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-base align-middle" />
                        </p>
                    </div>
                );
            case 'video':
                return (
                    <div ref={innerRef} className="w-full h-full overflow-hidden rounded-[16px] relative">
                        <video
                            src={slide.content}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
            case 'image':
            default:
                return (
                    <div ref={innerRef} className="w-full h-full overflow-hidden rounded-[16px] relative">
                        <img
                            src={slide.content}
                            alt="Slide content"
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
        }
    };

    return (
        <div
            ref={slideRef}
            className="w-full h-full p-4"
            style={{
                gridColumn: `${slide.col} / span ${slide.colSpan || 1}`,
                gridRow: `${slide.row} / span ${slide.rowSpan || 1}`,
            }}
        >
            {content()}
        </div>
    );
}
