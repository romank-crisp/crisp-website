"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CenteredQuoteProps {
    className?: string;
}

export const SharedCenteredQuote = ({ quote, author, className }: { quote?: string; author?: string; className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const shapesRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !textRef.current) return;

        const words = textRef.current.querySelectorAll(".quote-word");

        // Create timeline for coordinated animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
                end: "top 20%",
                scrub: 1,
            },
        });

        // Staggered word reveal with multiple effects
        tl.fromTo(words,
            {
                opacity: 0,
                y: 20,
                scale: 0.9,
                rotationX: -45,
                filter: "blur(4px)",
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                filter: "blur(0px)",
                stagger: {
                    each: 0.02,
                    from: "start",
                    ease: "power2.out",
                },
                duration: 0.5,
                ease: "power3.out",
            }
        );

        // Color transition animation (after reveal)
        gsap.to(words, {
            color: "#ffffff",
            stagger: {
                each: 0.05,
                ease: "power1.inOut",
            },
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 20%",
                end: "bottom 60%",
                scrub: true,
            },
        });

    }, { scope: containerRef });

    const text = quote || "We build digital products that move fast and break nothing.";
    const words = text.split(" ");

    return (
        <section
            ref={containerRef}
            className={`relative flex items-center justify-center bg-transparent overflow-hidden py-64 md:py-128 my-[20vh] ${className || ""}`}
        >
            {/* Content */}
            <div className="relative z-10 max-w-[76rem] mx-auto text-center px-6">
                <p
                    ref={textRef}
                    className="text-white/30 text-3xl md:text-5xl lg:text-5xl font-light leading-[1.2] tracking-tight flex flex-wrap justify-center gap-x-[0.25em] gap-y-1"
                >
                    {words.map((word, i) => (
                        <span key={i} className="quote-word inline-block text-[#9ca3af] opacity-0 will-change-transform perspective-1000">
                            {word}
                        </span>
                    ))}
                </p>
                {author && (
                    <div className="mt-16 text-white/50 text-sm tracking-widest uppercase font-medium">
                        {author}
                    </div>
                )}
            </div>
        </section>
    );
}
