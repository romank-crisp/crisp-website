"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie from "lottie-web";
import Link from "next/link";

// Register plugin once at module level
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

import { WhereWeCanHelpData } from "@/types/home";

interface WhereWeCanHelpProps {
    data: WhereWeCanHelpData;
}

export function WhereWeCanHelp({ data }: WhereWeCanHelpProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lottieContainerRef = useRef<HTMLDivElement>(null);
    const ctaLottieRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<any>(null);
    const ctaAnimationRef = useRef<any>(null);

    useEffect(() => {
        if (!lottieContainerRef.current) return;

        // Determine which JSON to use based on brand color
        const getBrandColorJson = () => {
            const brandColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-brand')
                .trim();

            // Convert RGB values to hex for comparison
            const rgbValues = brandColor.split(' ').map(v => parseInt(v));
            const isRedBrand = rgbValues[0] === 224 && rgbValues[1] === 12 && rgbValues[2] === 51; // #E00C33

            return isRedBrand ? '/img/home/home-1-brand1.json' : '/img/home/home-1-brand2.json';
        };

        const jsonPath = getBrandColorJson();

        // Load and initialize Lottie animation
        fetch(jsonPath)
            .then((res) => res.json())
            .then((animationData) => {
                if (animationRef.current) {
                    animationRef.current.destroy();
                }

                const anim = lottie.loadAnimation({
                    container: lottieContainerRef.current!,
                    renderer: "svg",
                    loop: false,
                    autoplay: false,
                    animationData: animationData,
                });

                animationRef.current = anim;

                anim.addEventListener("DOMLoaded", () => {
                    setupScrollTriggers();
                });
            })
            .catch((err) => console.error("Failed to load Lottie animation:", err));

        return () => {
            if (animationRef.current) {
                animationRef.current.destroy();
            }
        };
    }, []);

    // Load CTA Lottie animation
    useEffect(() => {
        if (!ctaLottieRef.current) return;

        fetch("/img/home/home-2.json")
            .then((res) => res.json())
            .then((animationData) => {
                if (ctaAnimationRef.current) {
                    ctaAnimationRef.current.destroy();
                }

                const anim = lottie.loadAnimation({
                    container: ctaLottieRef.current!,
                    renderer: "svg",
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                });

                ctaAnimationRef.current = anim;
            })
            .catch((err) => console.error("Failed to load CTA Lottie animation:", err));

        return () => {
            if (ctaAnimationRef.current) {
                ctaAnimationRef.current.destroy();
            }
        };
    }, []);

    const setupScrollTriggers = () => {
        if (!containerRef.current || !animationRef.current) return;

        const ctx = gsap.context(() => {
            const animation = animationRef.current;
            const totalFrames = animation.totalFrames;

            // Scrub Lottie based on total container scroll
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                id: "lottie-brain-scrub",
                onUpdate: (self) => {
                    const frame = Math.floor(self.progress * (totalFrames - 1));
                    animation.goToAndStop(frame, true);
                },
            });

            // Animate Title In (Word by Word)
            if (titleRef.current) {
                const words = titleRef.current.querySelectorAll(".word-span");

                gsap.fromTo(words,
                    { y: "100%", opacity: 0 },
                    {
                        y: "0%",
                        opacity: 1,
                        stagger: 0.1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            // Animate Service Sections
            data.services.forEach((service, index) => {
                const section = containerRef.current?.querySelector(`[data-service="${index}"]`);
                if (!section) return;

                const textContent = section.querySelector(".service-content");
                const isLastService = index === data.services.length - 1;

                if (textContent) {
                    gsap.set(textContent, { opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" });

                    // Fade In with enhanced effects
                    // Last service starts appearing later
                    gsap.to(textContent, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: isLastService ? "top 60%" : "top 70%",
                            end: "top 40%",
                            scrub: 1.5,
                        }
                    });

                    // Fade Out with enhanced effects
                    // Skip fade-out for the last service - it stays on screen
                    if (!isLastService) {
                        gsap.to(textContent, {
                            opacity: 0,
                            y: -40,
                            scale: 0.95,
                            filter: "blur(8px)",
                            duration: 1,
                            ease: "power3.in",
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom 60%",
                                end: "bottom 25%",
                                scrub: 2,
                            }
                        });
                    }
                }
            });

            ScrollTrigger.refresh();
        }, containerRef);

        return () => ctx.revert();
    };

    return (
        <div
            ref={containerRef}
            className="relative bg-[#120C2A] text-white"
        >
            {/* 
         Sticky Background Wrapper
         Holds the Lottie animation fixed in view while content scrolls over it.
      */}
            <div className="sticky top-0 h-screen overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Removed mix-blend-screen to ensure clean layering */}
                    <div className="scale-[1.5] w-[600px] h-[600px] transform-gpu opacity-50 md:opacity-100">
                        <div ref={lottieContainerRef} className="w-full h-full" />
                    </div>
                </div>
            </div>

            {/* 
         Scrolling Content Wrapper 
         We pull this up so it starts scrolling immediately.
      */}
            <div className="relative z-10 -mt-[100vh]">

                {/* Title Section (Scrolls naturally) 
             Adjusted padding to keep title visually separated from brain center.
             Reduced min-height so it's compact at the top.
         */}
                <div className="relative z-20 flex justify-center pt-16 pb-16 md:pt-24 md:pb-32 pointer-events-none px-4 md:px-0">
                    <div ref={titleRef} className="max-w-[1475px] w-full mx-auto text-center">
                        <h2 className="font-mega text-mega-h2 leading-none uppercase">
                            {data.title.map((word: string, i: number) => (
                                <div key={i} className={`overflow-hidden inline-block ${i < data.title.length - 1 ? 'mr-3' : ''}`}>
                                    <span className={`word-span inline-block ${i < 2 ? 'text-brand' : 'text-white'}`}>
                                        {word}
                                    </span>
                                </div>
                            ))}
                        </h2>
                    </div>
                </div>

                {/* Spacer for brain appearance animation (1 second of Lottie) */}
                <div className="h-[50vh]" />

                {/* Services (Scroll naturally) */}
                <div className="pb-16 space-y-16 md:pb-32 md:space-y-32">
                    {data.services.map((service, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div
                                key={index}
                                data-service={index}
                                className="min-h-[50vh] flex items-center justify-center py-16"
                            >
                                <div className="max-w-[1475px] w-full mx-auto px-4 md:px-0">
                                    {/* Chess Layout: Alternating Left/Right */}
                                    <div className={`flex w-full ${isEven ? 'justify-start' : 'justify-end'}`}>
                                        <div className="max-w-md w-full">
                                            <div className="service-content">
                                                <h3 className="font-heading text-h2 font-bold text-brand leading-tight mb-4">
                                                    {service.title}
                                                </h3>
                                                <p className="font-text text-text-lg text-white/80 leading-relaxed mb-6">
                                                    {service.description}
                                                </p>

                                                <div className="flex flex-wrap gap-3">
                                                    {service.labels.map((label, labelIndex) => (
                                                        <div
                                                            key={labelIndex}
                                                            className="font-heading text-sm font-bold uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1.5 rounded-full bg-text/50 backdrop-blur-md"
                                                        >
                                                            {label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Lottie Animation */}
                <div className="flex justify-end py-64 md:py-128">
                    <div className="max-w-[1475px] w-full mx-auto px-4 md:px-64">
                        <Link href="/works" className="block w-fit ml-auto cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div ref={ctaLottieRef} className="w-[210px] h-[210px] md:w-[280px] md:h-[280px]" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
