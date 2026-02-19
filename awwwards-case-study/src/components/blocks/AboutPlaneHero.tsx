"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AboutHeroData } from "@/content/about";

gsap.registerPlugin(ScrollTrigger);

export function AboutPlaneHero({ data }: { data: AboutHeroData }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const headerRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        const video = videoRef.current;
        if (!video) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });

        // Wait for metadata to ensure valid duration
        const setupAnimation = () => {
            // Scrub video frame by frame through the full duration
            // The video will complete exactly when scrolling reaches the end of the section
            tl.to(video, {
                currentTime: video.duration,
                ease: "none"
            });
        };

        if (video.readyState >= 1) {
            setupAnimation();
        } else {
            video.onloadedmetadata = setupAnimation;
        }

        // Touch device hack to force wake up video
        const isTouchDevice = () => {
            return (
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                // @ts-ignore
                navigator.msMaxTouchPoints > 0
            );
        };

        if (isTouchDevice()) {
            video.play().then(() => {
                video.pause();
            }).catch(() => {
                // Autoplay might be blocked, but scroll scrubbing usually works once trusted
            });
        }

        // Header phrase animation
        gsap.fromTo(".hero-word-inner",
            { y: "110%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "circ.out",
                delay: 0.2
            }
        );

        // Text block animations
        const selectors = [".about-text-1", ".about-text-2", ".about-text-3", ".about-text-4"];
        selectors.forEach((selector) => {
            gsap.fromTo(selector,
                { opacity: 0, y: 50, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 85%",
                        end: "top 50%",
                        scrub: true,
                    }
                }
            );
        });

        ScrollTrigger.refresh();
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative min-h-[150vh] w-full"
        >
            {/* BACKGROUND LAYER: Sticky Video */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="sticky top-0 h-screen w-full flex flex-col justify-end overflow-hidden z-10 pb-0">
                    <div className="relative w-full max-w-[1200px] aspect-[16/9] mx-auto overflow-hidden opacity-30">
                        <video
                            ref={videoRef}
                            src="/img/about-plane-fixed.mp4"
                            className="w-full h-full object-contain object-bottom"
                            muted
                            playsInline
                            preload="auto"
                        />
                    </div>
                </div>
            </div>

            {/* FOREGROUND LAYER: Scrolling Content */}
            <div className="relative z-20 w-full pt-[15vh]">
                <div className="max-w-[1440px] mx-auto px-16 md:px-64 w-full flex flex-col items-start">

                    {/* Header */}
                    <div className="mb-[15vh] w-full">
                        <h4 className="font-heading text-h4 mb-4 text-gray-500">
                            About Us
                        </h4>
                        <h1 ref={headerRef} className="font-mega text-mega-h2 text-brand uppercase text-left max-w-5xl flex flex-wrap gap-x-[0.25em] px-[3px] py-[3px]">
                            {data.headerWords.map((word, i) => (
                                <span key={i} className="inline-block overflow-hidden">
                                    <span className="hero-word-inner inline-block">
                                        {word}
                                    </span>
                                </span>
                            ))}
                            <span className="inline-block overflow-hidden">
                                <span className="hero-word-inner inline-block text-text">{data.headerSuffix.since}</span>
                            </span>
                            <span className="inline-block overflow-hidden">
                                <span className="hero-word-inner inline-block text-text">{data.headerSuffix.year}</span>
                            </span>
                        </h1>
                    </div>

                    {/* Two-Column Layout: Text blocks flow vertically within their own columns */}
                    <div className="grid grid-cols-1 md:grid-cols-12 w-full pb-[15vh]">

                        {/* Left Column (Cols 2-5): Blocks 1 and 3 */}
                        <div className="md:col-span-4 md:col-start-2 flex flex-col gap-[30vh]">
                            {/* Block 1 */}
                            <div className="about-text-1">
                                <h4 className="font-heading text-h4 mb-12 text-brand">{data.blocks[0].title}</h4>
                                <p className="font-text text-[24px] md:text-[32px] text-text leading-[1.2] tracking-tight text-left">
                                    {data.blocks[0].content}
                                </p>
                            </div>

                            {/* Block 3 */}
                            <div className="about-text-3">
                                <h4 className="font-heading text-h4 mb-12 text-brand">{data.blocks[2].title}</h4>
                                <p className="font-text text-[24px] md:text-[32px] text-text leading-[1.2] tracking-tight text-left">
                                    {data.blocks[2].content}
                                </p>
                            </div>
                        </div>

                        {/* Right Column (Cols 8-11): Blocks 2 and 4 */}
                        <div className="md:col-span-4 md:col-start-8 flex flex-col gap-[30vh] pt-[20vh]">
                            {/* Block 2 */}
                            <div className="about-text-2">
                                <h4 className="font-heading text-h4 mb-12 text-brand">{data.blocks[1].title}</h4>
                                <p className="font-text text-[24px] md:text-[32px] text-text leading-[1.2] tracking-tight text-left">
                                    {data.blocks[1].content}
                                </p>
                            </div>

                            {/* Block 4 */}
                            <div className="about-text-4">
                                <h4 className="font-heading text-h4 mb-12 text-brand">{data.blocks[3].title}</h4>
                                <p className="font-text text-[24px] md:text-[32px] text-text leading-[1.2] tracking-tight text-left">
                                    {data.blocks[3].content}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
