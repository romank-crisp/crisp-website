"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CenteredQuoteProps {
    className?: string;
}

export function CenteredQuote({ className }: CenteredQuoteProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const shapesRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !textRef.current) return;

        const words = textRef.current.querySelectorAll(".word");

        // Step 1: Fade in text after background transition completes
        gsap.fromTo(words,
            { opacity: 0, y: 20, color: "#9ca3af" }, // Start from gray-400
            {
                opacity: 1,
                y: 0,
                color: "#9ca3af", // Keep grey during fade-in
                stagger: 0.05,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 50%",
                    end: "top 30%",
                    scrub: 1,
                },
            }
        );

        // Step 2: Text color change animation on scroll (after fade-in)
        gsap.to(words, {
            color: "#ffffff",
            stagger: 0.1,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 30%",
                end: "bottom 60%",
                scrub: true,
            },
        });

    }, { scope: containerRef });

    const text = "8 years of building bold ideas with like-minded partners—across cities, time zones, and disciplines. We're building what's next.";
    const words = text.split(" ");

    return (
        <section
            ref={containerRef}
            className={`relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden py-64 px-6 ${className || ""}`}
        >
            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <p
                    ref={textRef}
                    className="text-white/30 text-3xl md:text-5xl lg:text-5xl font-light leading-[1.3] flex flex-wrap justify-center gap-x-[0.25em] gap-y-2 tracking-tight"
                >
                    {words.map((word, i) => (
                        <span key={i} className="word inline-block text-[#9ca3af] opacity-0">
                            {word}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
}
