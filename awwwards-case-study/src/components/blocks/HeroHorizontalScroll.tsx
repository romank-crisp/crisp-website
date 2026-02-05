"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { HERO_SLIDES, TRACK_WIDTH } from "./hero-horizontal/slides";
import { SlideRenderer } from "./hero-horizontal/SlideRenderer";
import { ProgressBar } from "@/components/ui/ProgressBar";

gsap.registerPlugin(ScrollTrigger);

export function HeroHorizontalScroll() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    // Check for reduced motion preference
    useLayoutEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    useLayoutEffect(() => {
        if (isReducedMotion) return; // Skip GSAP setup if reduced motion is preferred

        const section = sectionRef.current;
        const track = trackRef.current;

        if (!section || !track) return;

        // Configuration
        // Fixed track width is 2000px as per requirements
        // We scroll until the end of the track is visible, or stop if viewport > track
        const getScrollDistance = () => {
            const viewportWidth = window.innerWidth;
            const trackWidth = viewportWidth * 2.5; // 250vw
            return Math.max(0, trackWidth - viewportWidth);
        };

        let ctx = gsap.context(() => {
            const scrollDist = getScrollDistance();

            // Only create scroll trigger if there is something to scroll
            if (scrollDist > 0) {
                // Pin the section
                // Scroll behavior:
                // Animate track x from 0 to -scrollDist
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        start: "top top",
                        // "end" defines the scroll distance of the pin. 
                        // Requirement: "scrolls across in ~3 viewport heights"
                        end: "+=300vh",
                        scrub: 1,
                        onUpdate: (self) => setProgress(self.progress),
                        invalidateOnRefresh: true,
                    }
                });

                tl.to(track, {
                    x: -scrollDist,
                    ease: "none"
                });
            } else {
                // Determine behavior for large screens (viewport >= 2000px)
                // "degrades gracefully" -> Center the track? Or just let it sit left aligned?
                // Text implies "visible progress indicator" reflects scroll progress 0..1
                // For static large screens, progress can be fixed or purely time-based?
                // Let's assume static with full progress or 0.
                setProgress(1);
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [isReducedMotion]);

    // Reduced Motion Fallback Layout
    if (isReducedMotion) {
        return (
            <div className="w-full bg-white relative">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-[15vh] pb-[15vh]">
                    <h1 className="font-mega text-mega-h2 uppercase leading-none text-center">About Us</h1>
                </div>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-32 space-y-32">
                    {HERO_SLIDES.map((slide) => (
                        <div key={slide.id} className="relative w-full h-auto min-h-[40vh] border-b border-gray-100 py-12">
                            {/* Override grid styles for fallback by passing style prop if supported? 
                                SlideRenderer currently takes style from props? No.
                                It uses inline style based on slide.col/row.
                                Those grid-column styles won't hurt in a flex-col/block context (they just do nothing).
                                So basic wrapping works.
                            */}
                            <SlideRenderer
                                slide={slide}
                                scrollProgress={1}
                                trackRef={trackRef as React.RefObject<HTMLDivElement>}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <section
                ref={sectionRef}
                className="w-full h-screen relative bg-white overflow-hidden flex flex-col"
            >
                {/* About Us Header - Static Pinned */}
                <div className="relative z-20 w-full flex justify-center pt-[15vh] pointer-events-none">
                    <h1 className="font-mega text-mega-h2 uppercase leading-none text-center">About Us</h1>
                </div>

                {/* Fixed Track Container */}
                <div
                    ref={trackRef}
                    className="absolute top-0 left-0 h-full grid grid-cols-6 grid-rows-4 items-center pl-[5vw] pr-[5vw]"
                    style={{
                        width: '250vw',
                        willChange: 'transform',
                        paddingTop: '35vh' // Push content below the header (15vh margin + text height approx)
                    }}
                >
                    {/* Debug Grid Cells */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none z-0 opacity-10">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="border border-black flex items-center justify-center text-xs font-mono">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {HERO_SLIDES.map((slide) => (
                        <SlideRenderer
                            key={slide.id}
                            slide={slide}
                            scrollProgress={progress}
                            trackRef={trackRef as React.RefObject<HTMLDivElement>}
                        />
                    ))}
                </div>
            </section>

            <ProgressBar progress={progress} />
        </>
    );
}
