"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getAssetUrl } from "@/lib/utils";

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
    videoMobileSrc?: string;
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

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const videoSrc = isMobile && data.videoMobileSrc
        ? getAssetUrl(data.videoMobileSrc)
        : getAssetUrl(data.videoSrc);

    useGSAP(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        const sticky = stickyRef.current;
        const wrapper = videoWrapperRef.current;
        if (!video || !container || !sticky || !wrapper) return;

        let retryCount = 0;
        let timeoutId: NodeJS.Timeout;

        const setupAnimation = () => {
            let duration = video.duration;

            // Handle cross-origin edge cases where duration is NaN or Infinity initially
            if (!duration || isNaN(duration) || duration === Infinity || duration <= 0) {
                if (retryCount < 20) {
                    retryCount++;
                    timeoutId = setTimeout(setupAnimation, 100);
                    return;
                }
                duration = 8; // Fail-safe fallback
            }

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

            // 1) Scrub video from 0 → full duration
            master.to(video, {
                currentTime: duration,
                ease: "none",
                duration: 1,
            }, 0);

            // 2) Zoom: video wrapper goes from contained → full viewport (desktop only)
            if (!isMobile) {
                master.fromTo(wrapper, {
                    width: "100%",
                    maxWidth: "1475px",
                    borderRadius: "16px",
                    margin: "0 auto",
                }, {
                    width: "100vw",
                    maxWidth: "100vw",
                    borderRadius: "0px",
                    margin: "0",
                    ease: "power2.inOut",
                    duration: 0.3,
                }, 0);
            }

            // 3) Text overlays — all travel from 90vh, different destinations
            const lastIdx = data.overlays.length - 1;

            // 4) Header title fades out early to prevent overlap
            if (headerRef.current) {
                gsap.set(headerRef.current, { opacity: 1, y: 0 });
                master.to(headerRef.current, {
                    opacity: 0,
                    y: -80,
                    ease: "power2.in",
                    duration: 0.1,
                }, 0.05); // Finishes by 0.15
            }

            data.overlays.forEach((overlay, i) => {
                const el = overlayRefs.current[i];
                if (!el) return;

                const isLast = i === lastIdx;
                // Start overlaps after title finishes (0.15)
                const startFraction = 0.2 + (i * 0.25);
                const travelDuration = 0.25;

                // Destination: desktop 1st/2nd=50vh, desktop 3rd=60vh, mobile=70vh
                let destination: string;
                if (isMobile) {
                    destination = "70vh";
                } else {
                    destination = isLast ? "60vh" : "50vh";
                }

                gsap.set(el, { top: "80vh", opacity: 0 });

                if (isLast) {
                    // Last block fades in and locks at destination (shorter travel)
                    master.to(el, { opacity: 1, ease: "power2.out", duration: travelDuration * 0.2 }, startFraction);
                    master.fromTo(el, { top: "80vh" }, { top: destination, ease: "power3.out", duration: travelDuration }, startFraction);
                } else {
                    // Other blocks scroll continuously Past the screen (shorter travel, e.g. 80vh -> 30vh)
                    master.fromTo(el, { top: "80vh" }, { top: "30vh", ease: "none", duration: travelDuration }, startFraction);
                    
                    // 20% fade in
                    master.to(el, { opacity: 1, ease: "none", duration: travelDuration * 0.2 }, startFraction);
                    
                    // 20% fade out at the end
                    master.to(el, { opacity: 0, ease: "none", duration: travelDuration * 0.2 }, startFraction + (travelDuration * 0.8));
                }
            });
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
            clearTimeout(timeoutId);
            video.removeEventListener("loadedmetadata", setupAnimation);
        };
    }, { scope: containerRef, dependencies: [isMobile] });


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
                {/* Video wrapper */}
                <div
                    ref={videoWrapperRef}
                    className="relative overflow-hidden will-change-transform"
                    style={{
                        width: isMobile ? "calc(100% - 48px)" : "100%",
                        maxWidth: isMobile ? undefined : "1475px",
                        borderRadius: isMobile ? "12px" : "16px",
                        aspectRatio: isMobile ? undefined : "16/9",
                        height: isMobile ? "100vh" : undefined,
                        margin: "0 auto",
                    }}
                >
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        crossOrigin="anonymous"
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        playsInline
                        preload="auto"
                    />

                    {/* Vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
                </div>

                {/* Text overlays strictly aligned to standard Crisp 1475px grid */}
                <div className="absolute inset-x-0 top-0 h-screen pointer-events-none z-10 overflow-hidden text-center">
                    {data.overlays.map((overlay, i) => {
                        const isRight = i % 2 === 1;

                        return (
                            <div
                                key={overlay.id}
                                ref={(el) => { overlayRefs.current[i] = el; }}
                                className="absolute left-0 right-0 pointer-events-none mx-auto w-full max-w-[1475px] px-6 md:px-16"
                                style={{
                                    opacity: 0,
                                }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-0 lg:gap-x-[24px]">
                                    <div
                                        className={
                                            isMobile
                                                ? "col-span-1"
                                                : isRight
                                                    ? "lg:col-start-8 lg:col-span-5"
                                                    : "lg:col-start-1 lg:col-span-5"
                                        }
                                    >
                                        <p className="font-text text-text-sm md:text-text-lg text-white drop-shadow-lg leading-relaxed text-left">
                                            {overlay.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section title */}
                {data.sectionTitle && (
                    <h1
                        ref={headerRef}
                        className="absolute inset-0 flex items-center justify-center font-heading text-h2 md:text-h1 text-white text-center z-20 pointer-events-none drop-shadow-lg"
                    >
                        <span className="max-w-[800px] px-8">{data.sectionTitle}</span>
                    </h1>
                )}
            </div>
        </section>
    );
}
