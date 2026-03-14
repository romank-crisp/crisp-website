"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServicesData } from "@/content/services";
import { getAssetUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface AIVisualHeaderZoomProps {
    data?: ServicesData["hero"];
}

interface CloudImage {
    src: string;
    gridClass: string;
    isCenter?: boolean;
}

const cloudImages: CloudImage[] = [
    // CENTER HERO (2×2 — square)
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-01.jpg"), isCenter: true, gridClass: "col-start-4 col-span-2 row-start-3 row-span-2" },

    // Top row — four 2×2 blocks (rows 1-2)
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots01.jpg"), gridClass: "col-start-1 col-span-2 row-start-1 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-02.jpg"), gridClass: "col-start-3 col-span-2 row-start-1 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots02.jpg"), gridClass: "col-start-5 col-span-2 row-start-1 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-03.jpg"), gridClass: "col-start-7 col-span-2 row-start-1 row-span-2" },

    // Mid row flanks (rows 3-4)
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots03.jpg"), gridClass: "col-start-1 col-span-2 row-start-3 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-04.jpg"), gridClass: "col-start-3 col-span-1 row-start-3 row-span-1" },
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots04.jpg"), gridClass: "col-start-6 col-span-1 row-start-3 row-span-1" },
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots01.jpg"), gridClass: "col-start-3 col-span-1 row-start-4 row-span-1" },
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-02.jpg"), gridClass: "col-start-6 col-span-1 row-start-4 row-span-1" },
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots02.jpg"), gridClass: "col-start-7 col-span-2 row-start-3 row-span-2" },

    // Bottom row — four 2×2 blocks (rows 5-6)
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-03.jpg"), gridClass: "col-start-1 col-span-2 row-start-5 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots03.jpg"), gridClass: "col-start-3 col-span-2 row-start-5 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-keyvisuals-04.jpg"), gridClass: "col-start-5 col-span-2 row-start-5 row-span-2" },
    { src: getAssetUrl("img/services/ai-case-study/ai-product-shots04.jpg"), gridClass: "col-start-7 col-span-2 row-start-5 row-span-2" },
];

export function AIVisualHeaderZoom({ data }: AIVisualHeaderZoomProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollSectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const outerImagesRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current || !scrollSectionRef.current || !gridRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollSectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5, // smoother technique
            }
        });

        // Center = 2/8 * 240vw = 60vw. At 1.3 scale → ~78vw ≈ 1475px on 1900px viewport
        const initialScale = 1.3;

        // Center the grid via GSAP transforms
        gsap.set(gridRef.current, { xPercent: -50, yPercent: -52, scale: initialScale, transformOrigin: "center center" });

        // Apply fade out to outer images
        cloudImages.forEach((img, idx) => {
            const el = outerImagesRef.current[idx];
            if (!el || img.isCenter) return;
            gsap.set(el, { opacity: 0, scale: 0.85 });
        });

        // Animation: zoom the grid out so we see more of the full visual grid
        tl.to(gridRef.current, {
            scale: 0.38,
            ease: "power2.inOut",
            duration: 1
        }, 0);

        // Animation: fade in outer images
        cloudImages.forEach((img, idx) => {
            if (!img.isCenter && outerImagesRef.current[idx]) {
                // Stagger their arrival slightly randomly
                tl.to(outerImagesRef.current[idx], {
                    opacity: 1,
                    scale: 1,
                    ease: "power2.out",
                    duration: 0.5
                }, 0.1 + (idx * 0.04));
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full bg-white">
            {/* Top Text Content - Not pinned, scrolls normally */}
            <div className="relative z-10 w-full pt-[15vh] pb-16 bg-white">
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
                        <div className="max-w-[480px]">
                            <p className="font-text text-text-lg text-black leading-relaxed">
                                {data?.description || "Static and motion — boost products visual intensity and connect your customers to the brands"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pinned Zoom Section */}
            <div ref={scrollSectionRef} className="relative w-full h-[400vh]">
                <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white cursor-crosshair">
                    {/* The Bento Box Grid */}
                    <div
                        ref={gridRef}
                        className="absolute top-[50%] left-[50%] w-[280vw] md:w-[240vw] h-[210vw] md:h-[180vw] grid grid-cols-8 grid-rows-6 gap-[64px] will-change-transform"
                    >
                        {cloudImages.map((img, idx) => {
                            const isCenter = img.isCenter;

                            return (
                                <div
                                    key={idx}
                                    ref={(el) => { outerImagesRef.current[idx] = el; }}
                                    className={`relative overflow-hidden will-change-transform ${img.gridClass} ${isCenter ? 'z-10 bg-white rounded-[24px] md:rounded-[32px]' : 'z-0 bg-gray-100 rounded-[16px] md:rounded-[24px]'}`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={`Product visual ${idx}`}
                                        fill
                                        className="object-cover"
                                        sizes={isCenter ? "(max-width: 768px) 100vw, 100vw" : "(max-width: 768px) 33vw, 33vw"}
                                        priority={isCenter}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
