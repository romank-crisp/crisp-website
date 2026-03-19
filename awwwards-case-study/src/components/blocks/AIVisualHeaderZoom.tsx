"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServicesData, CloudImage } from "@/content/services";
import { getAssetUrl } from "@/lib/utils";

export interface AIVisualHeaderZoomProps {
    data?: ServicesData["hero"];
}

const cloudImages: CloudImage[] = [
    // CENTER HERO (4×2 — widescreen ~1440x730)
    { src: getAssetUrl("img/services/ai-case-study/visuals-01.jpg"), videoSrc: "https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/services/ai-case-study/productvis.webm", isCenter: true, gridClass: "col-start-3 col-span-4 row-start-3 row-span-2" },

    // Top row — four 2×2 blocks (rows 1-2)
    { src: getAssetUrl("img/services/ai-case-study/visuals-02.jpg"), gridClass: "col-start-1 col-span-2 row-start-1 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-03.jpg"), gridClass: "col-start-3 col-span-2 row-start-1 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-04.jpg"), gridClass: "col-start-5 col-span-2 row-start-1 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-05.jpg"), gridClass: "col-start-7 col-span-2 row-start-1 row-span-2" },

    // Mid row flanks (rows 3-4)
    { src: getAssetUrl("img/services/ai-case-study/visuals-06.jpg"), gridClass: "col-start-1 col-span-2 row-start-3 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-07.jpg"), gridClass: "col-start-7 col-span-2 row-start-3 row-span-2" },

    // Bottom row — four 2×2 blocks (rows 5-6)
    { src: getAssetUrl("img/services/ai-case-study/visuals-08.jpg"), gridClass: "col-start-1 col-span-2 row-start-5 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-09.jpg"), gridClass: "col-start-3 col-span-2 row-start-5 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-02.jpg"), gridClass: "col-start-5 col-span-2 row-start-5 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/visuals-03.jpg"), gridClass: "col-start-7 col-span-2 row-start-5 row-span-2" },
];

export function AIVisualHeaderZoom({ data }: AIVisualHeaderZoomProps) {
    const activeImages = data?.bentoImages && data.bentoImages.length > 0 ? data.bentoImages : cloudImages;

    const containerRef = useRef<HTMLDivElement>(null);
    const scrollSectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const outerImagesRef = useRef<(HTMLDivElement | null)[]>([]);

    const [isMobile, setIsMobile] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Desktop-only GSAP zoom animation
    useGSAP(() => {
        if (isMobile) return;
        if (!containerRef.current || !scrollSectionRef.current || !gridRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollSectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
            }
        });

        // Calculate initial scale so center video (50% of grid) matches max-width
        const viewW = window.innerWidth;
        const maxContentW = Math.min(1475, viewW - 64); // max-width with px-8 padding
        // Center block = 4/8 cols = 50% of grid. Grid = 240vw.
        // We need: scale * 0.5 * 2.4 * viewW = maxContentW
        const initialScale = maxContentW / (0.5 * 2.4 * viewW);
        gsap.set(gridRef.current, { xPercent: -50, yPercent: -52, scale: initialScale, transformOrigin: "center center" });

        activeImages.forEach((img, idx) => {
            const el = outerImagesRef.current[idx];
            if (!el || img.isCenter) return;
            gsap.set(el, { opacity: 0, scale: 0.85 });
        });

        tl.to(gridRef.current, {
            scale: 0.38,
            ease: "power2.inOut",
            duration: 1
        }, 0);

        activeImages.forEach((img, idx) => {
            if (!img.isCenter && outerImagesRef.current[idx]) {
                tl.to(outerImagesRef.current[idx], {
                    opacity: 1,
                    scale: 1,
                    ease: "power2.out",
                    duration: 0.5
                }, 0.1 + (idx * 0.04));
            }
        });

    }, { scope: containerRef, dependencies: [isMobile] });

    return (
        <section ref={containerRef} className="relative w-full bg-white">
            {/* Top Text Content */}
            <div className="relative z-10 w-full pt-[15vh] pb-[32px] md:pb-16 bg-white">
                <div className="max-w-[1475px] mx-auto px-6 md:px-16 w-full flex flex-col">
                    <p className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-black mb-8">
                        {data?.label || "Visual Content Factory"}
                    </p>
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start lg:items-center justify-between">
                        <h1
                            className="font-mega text-mega-h2 uppercase text-[#E5193B] max-w-[900px]"
                            dangerouslySetInnerHTML={{
                                __html: (data?.title || "Product<br />Visuals<br />That Convert").replace(/We Create<br\s*\/>/gi, "")
                            }}
                        />
                        <div className="w-full lg:max-w-[480px]">
                            <p className="font-text text-text-lg text-black leading-[1.4]">
                                {data?.description || "Static and motion — boost products visual intensity and connect your customers to the brands"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Horizontal infinite scroll gallery — 1 row, swipeable */}
            {isMobile && (() => {
                const flatImages = activeImages.filter(img => !img.isCenter);
                const rowLoop = [...flatImages, ...flatImages, ...flatImages, ...flatImages];

                // Pause auto-scroll on touch, resume on release
                const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
                    const el = e.currentTarget;
                    el.style.animationPlayState = "paused";
                };
                const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
                    const el = e.currentTarget;
                    el.style.animationPlayState = "running";
                };

                return (
                    <div className="w-full overflow-hidden" style={{ height: "36vh" }}>
                        {/* Row 1 — scrolls left */}
                        <div
                            className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x h-full"
                        >
                            <div
                                className="flex gap-[12px] h-full"
                                style={{
                                    animation: "scrollLeft 60s linear infinite",
                                    width: "max-content",
                                }}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {rowLoop.map((img, idx) => (
                                    <div
                                        key={`r1-${idx}`}
                                        className="relative flex-shrink-0 rounded-[16px] overflow-hidden bg-gray-100 cursor-pointer h-full"
                                        style={{ width: "36vh" }}
                                        onClick={() => setPreviewSrc(getAssetUrl(img.src))}
                                    >
                                        {img.videoSrc ? (
                                            <video
                                                src={getAssetUrl(img.videoSrc)}
                                                className="absolute inset-0 w-full h-full object-cover rounded-[16px]"
                                                muted autoPlay loop playsInline
                                                poster={getAssetUrl(img.src)}
                                            />
                                        ) : (
                                            <Image
                                                src={getAssetUrl(img.src)}
                                                alt={`Visual ${idx}`}
                                                fill
                                                className="object-cover rounded-[16px]"
                                                sizes="36vh"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <style jsx>{`
                            @keyframes scrollLeft {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-25%); }
                            }
                        `}</style>
                    </div>
                );
            })()}

            {/* Fullscreen lightbox */}
            {previewSrc && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center animate-[fadeIn_300ms_ease-out]"
                    onClick={() => setPreviewSrc(null)}
                >
                    <button
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl z-10"
                        onClick={() => setPreviewSrc(null)}
                        aria-label="Close preview"
                    >
                        ✕
                    </button>
                    <div className="relative w-[90vw] h-[90vw] max-h-[80vh]">
                        <Image
                            src={previewSrc}
                            alt="Full preview"
                            fill
                            className="object-contain"
                            sizes="90vw"
                        />
                    </div>
                </div>
            )}

            {/* Desktop: Pinned Zoom Section */}
            {!isMobile && (
                <div ref={scrollSectionRef} className="relative w-full h-[400vh]">
                    <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white cursor-crosshair">
                        <div
                            ref={gridRef}
                            className="absolute top-[50%] left-[50%] w-[240vw] h-[180vw] grid grid-cols-8 grid-rows-6 gap-[64px] will-change-transform"
                        >
                            {activeImages.map((img, idx) => {
                                const isCenter = img.isCenter;
                                return (
                                    <div
                                        key={idx}
                                        ref={(el) => { outerImagesRef.current[idx] = el; }}
                                        className={`relative overflow-hidden will-change-transform ${img.gridClass} ${isCenter ? 'z-10 bg-white rounded-[32px]' : 'z-0 bg-gray-100 rounded-[24px]'}`}
                                    >
                                        {img.videoSrc ? (
                                            <video
                                                src={getAssetUrl(img.videoSrc)}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                muted
                                                autoPlay
                                                loop
                                                playsInline
                                                poster={getAssetUrl(img.src)}
                                            />
                                        ) : (
                                            <Image
                                                src={getAssetUrl(img.src)}
                                                alt={`Product visual ${idx}`}
                                                fill
                                                className="object-cover"
                                                sizes="100vw"
                                                priority={isCenter}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

/** Map desktop 8-col grid classes to mobile 4-col grid */
function getMobileGridClass(desktopClass: string, isCenter?: boolean): string {
    if (isCenter) return "col-start-1 col-span-4 row-start-3 row-span-2";

    // Parse col-start/col-span from desktop class
    const colStartMatch = desktopClass.match(/col-start-(\d+)/);
    const rowStartMatch = desktopClass.match(/row-start-(\d+)/);

    if (!colStartMatch || !rowStartMatch) return desktopClass;

    const dCol = parseInt(colStartMatch[1]);
    const dRow = parseInt(rowStartMatch[1]);

    // Map 8-col → 4-col: halve column positions
    const mCol = Math.max(1, Math.ceil(dCol / 2));

    return `col-start-${mCol} col-span-2 row-start-${dRow} row-span-2`;
}
