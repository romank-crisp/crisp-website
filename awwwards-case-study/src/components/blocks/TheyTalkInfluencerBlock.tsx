"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TheyTalkInfluencerBlockProps } from "@/types/case-study";
import { clsx } from "clsx";
import { getAssetUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function TheyTalkInfluencerBlock({
    videoSrc,
    overlayImageSrc,
    logoSrc,
    aspectRatio = "aspect-video md:aspect-[16/9]"
}: TheyTalkInfluencerBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Subtle scroll parallax or entrance animations
        gsap.from(videoRef.current, {
            scale: 1.1,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        gsap.from(textRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });

        gsap.from(logoRef.current, {
            x: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className={clsx("relative w-full overflow-hidden bg-[#8be700] flex items-center justify-center isolate", aspectRatio)}
        >
            <div className="relative w-full h-full max-w-[1920px] mx-auto overflow-hidden">

                {/* Center Video Container */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[90%] md:w-[390px] h-[85%] z-0">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover mix-blend-multiply pointer-events-none"
                    >
                        <source src={getAssetUrl(videoSrc)} type="video/webm" />
                    </video>
                </div>

                {/* SVG Graphics Overlay */}

                {/* 1. REAL VOICES -> REAL IMPACT (Central Graffiti) */}
                <div
                    ref={textRef}
                    className="absolute top-[35%] left-1/2 -translate-x-1/2 z-10 w-[70%] md:w-[1060px] h-[45%] pointer-events-none"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={getAssetUrl(overlayImageSrc)}
                            alt="Real Voices Real Impact"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* 2. Theytalk Logo (Top Right) */}
                <div
                    ref={logoRef}
                    className="absolute top-[25%] right-[10%] z-20 w-[180px] md:w-[266px] pointer-events-none"
                >
                    <Image
                        src={getAssetUrl(logoSrc)}
                        alt="TheyTalk Logo"
                        width={266}
                        height={80}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}
