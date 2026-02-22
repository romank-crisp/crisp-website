"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAM_IMAGES = [
    "/img/teampic/team-gallery-1.JPG",
    "/img/teampic/team-gallery-2.JPG",
    "/img/teampic/team-gallery-3.JPG",
    "/img/teampic/team-gallery-4.JPG",
    "/img/teampic/team-gallery-5.JPG",
    "/img/teampic/team-gallery-6.JPG",
    "/img/teampic/team-gallery-7.JPG",
    "/img/teampic/team-gallery-8.JPG",
];

const WIDTHS = [
    "w-[420px] md:w-[570px]",
    "w-[510px] md:w-[660px]",
    "w-[450px] md:w-[600px]",
    "w-[480px] md:w-[630px]",
    "w-[390px] md:w-[540px]",
];

export const AboutTeamGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useGSAP(() => {
        if (!containerRef.current || !sliderRef.current) return;

        // Appearance Animation
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Infinite Scroll Animation (Right to Left)
        tweenRef.current = gsap.to(sliderRef.current, {
            xPercent: -50, // Move left by 50% of total width (covers 2 sets)
            ease: "none",
            duration: 80, // 4x slower
            repeat: -1
        });

    }, { scope: containerRef });

    // Triple the images to ensure smooth looping on wide screens (4 sets total)
    const galleryImages = [...TEAM_IMAGES, ...TEAM_IMAGES, ...TEAM_IMAGES, ...TEAM_IMAGES];

    return (
        <section
            ref={containerRef}
            className="w-full relative z-10 overflow-hidden py-32 md:py-48 opacity-0 -mt-32 md:-mt-64"
        >
            <div className="w-full">
                <div
                    ref={sliderRef}
                    className="flex gap-[32px] w-max group hover:cursor-grab active:cursor-grabbing"
                    onMouseEnter={(e) => {
                        if (tweenRef.current) {
                            const x = e.clientX;
                            const width = window.innerWidth;
                            const targetScale = x < width / 2 ? 4.5 : -4.5;
                            gsap.to(tweenRef.current, { timeScale: targetScale, duration: 1.5, ease: "power2.inOut", overwrite: true });
                        }
                    }}
                    onMouseMove={(e) => {
                        if (tweenRef.current) {
                            const x = e.clientX;
                            const width = window.innerWidth;
                            const targetScale = x < width / 2 ? 4.5 : -4.5;

                            // Only update if the target scale is significantly different from the tween's destination
                            // or simple overwriting is fine given GSAP's efficiency, but let's be cleaner:
                            // We can use gsaps 'isActive' or just let it overwrite. 
                            // To prevent stuttering restart of ease, we check if we are already tweening to this value.
                            // But keeping it simple with overwrite: "auto" works best for responsiveness.
                            gsap.to(tweenRef.current, {
                                timeScale: targetScale,
                                duration: 1.5,
                                ease: "power2.inOut",
                                overwrite: "auto"
                            });
                        }
                    }}
                    onMouseLeave={() => {
                        if (tweenRef.current) {
                            gsap.to(tweenRef.current, { timeScale: 1, duration: 1.5, ease: "power2.inOut", overwrite: true });
                        }
                    }}
                >
                    {galleryImages.map((src, index) => (
                        <div
                            key={index}
                            className={`relative ${WIDTHS[index % WIDTHS.length]} h-[525px] md:h-[675px] flex-shrink-0 rounded-[8px] overflow-hidden transition-all duration-500 ease-out group-hover:opacity-30 hover:!opacity-100 hover:scale-125 hover:z-10`}
                        >
                            <Image
                                src={src}
                                alt={`Team member ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 510px, 660px"
                            />
                            {/* Optional overlay for better integration with dark bg */}
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
