"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Testimonial } from "@/types/home";

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

        // Phase 1: Reveal all to 0.6 using 3D tumble
        tl.to(words, {
            opacity: 0.6,
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
            // Phase 2: Highlight the specific group to 1.0
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
            <div className="max-w-[1475px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 lg:gap-x-24 items-center">

                {/* Left Column: Quote & Author Info */}
                <div className="lg:col-span-8 flex flex-col gap-24">
                    <div
                        ref={quoteRef}
                        className="font-heading text-h1 leading-[1.1] font-medium tracking-tight word-wrapper flex flex-wrap gap-x-[0.2em] gap-y-[0.1em]"
                    >
                        {(() => {
                            const parts = currentTestimonial.quote.split(/({.*?})/);
                            return parts.map((part, i) => {
                                if (part.startsWith('{') && part.endsWith('}')) {
                                    // Highlighted content
                                    const content = part.slice(1, -1);
                                    const words = content.split(" ");
                                    return words.map((word, wI) => (
                                        <span key={`${currentIndex}-h-${i}-${wI}`} className="inline-block is-highlighted perspective-1000 will-change-transform">
                                            {word}&nbsp;
                                        </span>
                                    ));
                                } else {
                                    // Regular content
                                    const words = part.split(" ").filter(w => w.length > 0);
                                    return words.map((word, wI) => (
                                        <span key={`${currentIndex}-r-${i}-${wI}`} className="inline-block perspective-1000 will-change-transform">
                                            {word}&nbsp;
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

                {/* Right Column: Empty to maintain space */}
                <div className="lg:col-span-4" />
            </div>
        </section>
    );
};
