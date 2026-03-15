"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface VideoScrollOverlay {
    id: string;
    text: string;
    timeSec: number;
    position: "top-center" | "bottom-left" | "bottom-right";
}

export interface VideoScrollData {
    sectionTitle?: string;
    videoSrc: string;
    overlays: VideoScrollOverlay[];
}

interface Props {
    data: VideoScrollData;
}

export function AIVisualVideoScroll({ data }: Props) {
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
            //    Each phrase scrolls upward continuously
            //    Positioned: left (cols 2-5), right (cols 8-11), left (cols 2-5)
            data.overlays.forEach((overlay, i) => {
                const el = overlayRefs.current[i];
                if (!el) return;

                // Ensure overlays start AFTER zoom completes (0.3)
                const rawFraction = overlay.timeSec / duration;
                const fraction = Math.max(rawFraction, 0.35);

                const fadeIn = Math.min(0.28 / duration, fraction - 0.3);
                const fadeOut = 0.28 / duration;

                const maxVisibleDuration = 1.0 - fraction - fadeOut;
                const visibleDuration = Math.min(1.2 / duration, Math.max(0, maxVisibleDuration));

                const totalDur = fadeIn + visibleDuration + fadeOut;

                // Continuous upward scroll — 20% less travel (240px instead of 300px)
                master.fromTo(el, {
                    y: 240,
                    opacity: 0,
                }, {
                    y: -240,
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

            // 4) Header title — always visible by default.
            //    After zoom completes (0.3), scroll it up & fade out.
            if (headerRef.current) {
                gsap.set(headerRef.current, { opacity: 1, y: 0 });
                master.to(headerRef.current, {
                    opacity: 0,
                    y: -80,
                    ease: "power2.in",
                    duration: 0.12,
                }, 0.3);
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
            className="relative bg-white pt-[160px] pb-0"
            style={{ height: "500vh" }}
        >
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
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

                    {/* Text overlays — positioned on 12-col grid: left/right/left */}
                    {data.overlays.map((overlay, i) => {
                        // Alternating: 0=left(cols 2-5), 1=right(cols 8-11), 2=left(cols 2-5)
                        const isRight = i % 2 === 1;
                        const posClass = isRight
                            ? "right-0 pr-[8.33%] pl-[66.67%]"   // cols 8-11
                            : "left-0 pl-[8.33%] pr-[66.67%]"; // cols 2-5

                        return (
                            <div
                                key={overlay.id}
                                ref={(el) => { overlayRefs.current[i] = el; }}
                                className={`absolute inset-y-0 flex items-center pointer-events-none ${posClass}`}
                                style={{ opacity: 0 }}
                            >
                                <p className="font-text text-text-lg text-white drop-shadow-lg leading-relaxed text-left">
                                    {overlay.text}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Section title — rendered ABOVE the video wrapper, always visible by default */}
                {data.sectionTitle && (
                    <h1
                        ref={headerRef}
                        className="absolute inset-0 flex items-center justify-center font-heading text-h1 text-white text-center z-20 pointer-events-none drop-shadow-lg"
                    >
                        <span className="max-w-[800px] px-8">{data.sectionTitle}</span>
                    </h1>
                )}
            </div>
        </section>
    );
}
