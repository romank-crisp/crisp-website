"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface ProductInteractiveOverlay {
    id: string;
    text: string;
    timeSec: number;
    position: "top-center" | "bottom-left" | "bottom-right";
}

export interface ProductInteractiveData {
    sectionTitle?: string;
    videoSrc: string;
    overlays: ProductInteractiveOverlay[];
}

interface Props {
    data: ProductInteractiveData;
}

export function AIVisualProductInteractive({ data }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLHeadingElement>(null);
    const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        const sticky = stickyRef.current;
        const wrapper = videoWrapperRef.current;
        if (!video || !container || !sticky || !wrapper) return;

        const setupAnimation = () => {
            const duration = video.duration;
            if (!duration || duration <= 0) return;

            // ─── Master timeline pinned to the scroll section ───
            const master = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                },
            });

            // 1) Scrub video from 0 → full duration (1 timeline unit)
            master.to(video, {
                currentTime: duration,
                ease: "none",
                duration: 1,
            }, 0);

            // 2) Zoom: video wrapper goes from max-width contained → 100vw
            master.fromTo(wrapper, {
                maxWidth: "80vw",
                borderRadius: "16px",
            }, {
                maxWidth: "100vw",
                borderRadius: "0px",
                ease: "power2.inOut",
                duration: 0.3, // first 30% of timeline
            }, 0);

            // 3) Text overlays — show at specific video timestamps
            //    Each phrase scrolls upward continuously (large y travel)
            data.overlays.forEach((overlay, i) => {
                const el = overlayRefs.current[i];
                if (!el) return;

                const fraction = overlay.timeSec / duration;

                const fadeIn = Math.min(0.35 / duration, fraction);
                const fadeOut = 0.35 / duration;

                const maxVisibleDuration = 1.0 - fraction - fadeOut;
                const visibleDuration = Math.min(1.5 / duration, Math.max(0, maxVisibleDuration));

                const totalDur = fadeIn + visibleDuration + fadeOut;

                // Continuous upward scroll across the entire lifespan
                master.fromTo(el, {
                    y: 300,
                    opacity: 0,
                }, {
                    y: -300,
                    opacity: 1,
                    ease: "none",
                    duration: totalDur,
                }, fraction - fadeIn);

                // Opacity: fade in
                master.fromTo(el, {
                    opacity: 0,
                }, {
                    opacity: 1,
                    ease: "power2.out",
                    duration: fadeIn,
                }, fraction - fadeIn);

                // Opacity: fade out
                master.to(el, {
                    opacity: 0,
                    ease: "power2.in",
                    duration: fadeOut,
                }, fraction + visibleDuration);
            });

            // 4) Animate the header title — starts visible, fades out on scroll
            if (headerRef.current) {
                gsap.set(headerRef.current, { opacity: 1, y: 0 });

                master.to(headerRef.current, {
                    opacity: 0,
                    y: -80,
                    ease: "power2.in",
                    duration: 0.15, // Fades out in the first 15% of scroll
                }, 0);
            }
        };

        if (video.readyState >= 1) {
            setupAnimation();
        } else {
            video.addEventListener("loadedmetadata", setupAnimation, { once: true });
        }

        // Touch device hack — force video to "wake up" on iOS
        const isTouchDevice = () =>
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

        if (isTouchDevice()) {
            video.play().then(() => video.pause()).catch(() => { /* ok */ });
        }

        return () => {
            video.removeEventListener("loadedmetadata", setupAnimation);
        };
    }, { scope: containerRef });


    return (
        <section
            ref={containerRef}
            className="relative bg-white"
            style={{ height: "1000vh" }}
        >
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Video wrapper — starts constrained, zooms to full viewport */}
                <div
                    ref={videoWrapperRef}
                    className="relative w-full overflow-hidden will-change-transform"
                    style={{
                        maxWidth: "80vw",
                        borderRadius: "16px",
                        aspectRatio: "16/9",
                    }}
                >
                    <video
                        ref={videoRef}
                        src={data.videoSrc}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        playsInline
                        preload="auto"
                    />

                    {/* Slight vignette overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

                    {/* Section title — centered both vertically and horizontally */}
                    {data.sectionTitle && (
                        <h1
                            ref={headerRef}
                            className="absolute inset-0 flex items-center justify-center font-mega text-mega-h2 uppercase text-white text-center z-10 pointer-events-none drop-shadow-lg px-8"
                        >
                            {data.sectionTitle}
                        </h1>
                    )}

                    {/* Text overlays — all centered */}
                    {data.overlays.map((overlay, i) => (
                        <div
                            key={overlay.id}
                            ref={(el) => { overlayRefs.current[i] = el; }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 md:px-16"
                            style={{ opacity: 0 }}
                        >
                            <p className="font-text text-text-lg text-white drop-shadow-lg max-w-[600px] leading-relaxed text-center">
                                {overlay.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
