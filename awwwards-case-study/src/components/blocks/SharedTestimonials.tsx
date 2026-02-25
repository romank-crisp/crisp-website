"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Testimonial } from "@/types/home";
import { tokenizeText } from "@/components/ui/TextFormatter";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface SharedTestimonialsProps {
    testimonials: Testimonial[];
    autoPlayInterval?: number; // in milliseconds
    className?: string;
}

export const SharedTestimonials = ({
    testimonials,
    autoPlayInterval = 5000,
    className = "",
}: SharedTestimonialsProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // Keeping isPlaying for auto-play logic
    const containerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLParagraphElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);

    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [isPlaying, testimonials.length, autoPlayInterval]);

    // Animate content on testimonial change or scroll
    useGSAP(() => {
        if (!quoteRef.current || !metaRef.current) return;

        const words = quoteRef.current.querySelectorAll(".word-wrapper span");
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Select highlighted words based on class
        const highlightGroup = quoteRef.current.querySelectorAll(".word-wrapper span.is-highlighted");

        // Clear existing state with 3D props
        gsap.set(words, {
            opacity: 0,
            y: 20,
            scale: 0.9,
            rotationX: -45,
            filter: "blur(4px)",
            transformOrigin: "50% 50%"
        });
        gsap.set(metaRef.current, { opacity: 0, y: 15 });

        // Phase 1: Reveal all to 1.0 using 3D tumble
        tl.to(words, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: {
                each: 0.02,
                from: "start",
                ease: "power2.out",
            },
            ease: "power3.out"
        })
            // Phase 2: Handle specific group timing if needed (opacity is already 1, but we keep the timeline structure)
            .to(highlightGroup, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            }, "-=0.2")
            // Phase 3: Reveal meta
            .to(metaRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            }, "-=0.3");

    }, {
        dependencies: [currentIndex],
        scope: containerRef,
    });

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section
            ref={containerRef}
            className={`relative bg-white text-text py-64 md:py-128 ${className}`}
        >
            <div className="max-w-[1475px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 lg:gap-x-24 items-center px-16 md:px-64">

                {/* Desktop View: Auto-playing Quote & Author Info */}
                <div className="hidden md:flex lg:col-span-8 flex-col gap-24">
                    <div
                        ref={quoteRef}
                        className="font-heading text-h1 leading-[1.1] font-medium tracking-tight word-wrapper flex flex-wrap gap-x-[0.2em] gap-y-[0.1em]"
                    >
                        {(() => {
                            const tokens = tokenizeText(currentTestimonial.quote);
                            return tokens.map((token, tIndex) => {
                                const isHighlighted = token.type !== 'text';

                                let tokenClass = "inline-block perspective-1000 will-change-transform";
                                if (isHighlighted) {
                                    tokenClass += " is-highlighted";
                                }

                                if (token.type === 'dark-gradient') tokenClass += " italic font-serif animate-gradient-text-dark px-1";
                                else if (token.type === 'light-gradient') tokenClass += " italic font-serif animate-gradient-text px-1";
                                else if (token.type === 'italic') tokenClass += " italic font-serif text-text px-1";

                                if (isHighlighted) {
                                    // Treat the whole highlighted phrase as a single block 
                                    // to ensure the gradient spans the words and it animates synchronously
                                    return (
                                        <span key={`${currentIndex}-${tIndex}`} className={tokenClass}>
                                            {token.content}
                                        </span>
                                    );
                                } else {
                                    const words = token.content.split(" ").filter(w => w.length > 0);
                                    return words.map((word, wIndex) => (
                                        <span key={`${currentIndex}-${tIndex}-${wIndex}`} className={tokenClass}>
                                            {word}
                                        </span>
                                    ));
                                }
                            });
                        })()}
                    </div>

                    <div ref={metaRef} className="flex items-center gap-3 font-text text-text-md">
                        <span className="font-semibold text-brand">
                            {currentTestimonial.name}
                        </span>
                        <span className="text-text/40">
                            {currentTestimonial.position}
                        </span>
                    </div>
                </div>

                {/* Mobile View: Horizontal Snap Slider */}
                <div className="md:hidden lg:col-span-8 flex overflow-x-auto snap-x snap-mandatory gap-8 -mx-16 px-16 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ width: 'calc(100% + 32px)' }}>
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="shrink-0 w-[85vw] snap-center flex flex-col gap-16">
                            <div className="font-heading text-h3 leading-[1.1] font-medium tracking-tight flex flex-wrap gap-x-[0.2em] gap-y-[0.1em]">
                                {(() => {
                                    const tokens = tokenizeText(testimonial.quote);
                                    return tokens.map((token, tIndex) => {
                                        const isHighlighted = token.type !== 'text';
                                        let tokenClass = "inline-block";

                                        if (token.type === 'dark-gradient') tokenClass += " italic font-serif animate-gradient-text-dark px-1";
                                        else if (token.type === 'light-gradient') tokenClass += " italic font-serif animate-gradient-text px-1";
                                        else if (token.type === 'italic') tokenClass += " italic font-serif text-text px-1";

                                        if (isHighlighted) {
                                            return (
                                                <span key={`mob-${idx}-${tIndex}`} className={tokenClass}>
                                                    {token.content}
                                                </span>
                                            );
                                        } else {
                                            const words = token.content.split(" ").filter(w => w.length > 0);
                                            return words.map((word, wIndex) => (
                                                <span key={`mob-${idx}-${tIndex}-${wIndex}`} className={tokenClass}>
                                                    {word}
                                                </span>
                                            ));
                                        }
                                    });
                                })()}
                            </div>
                            <div className="flex items-center gap-3 font-text text-text-md">
                                <span className="font-semibold text-brand">{testimonial.name}</span>
                                <span className="text-text/40">{testimonial.position}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Empty to maintain space */}
                <div className="hidden lg:col-span-4 lg:block" />
            </div>
        </section>
    );
};
