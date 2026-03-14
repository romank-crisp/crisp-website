"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAssetUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

import { ServicesData } from "@/content/services";

export function SharedServicesHero({ data }: { data?: ServicesData['hero'] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const mediaInnerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !mediaContainerRef.current || !mediaInnerRef.current) return;

        // Animate the container width to 100vw and remove border radius
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: mediaContainerRef.current,
                start: "top 75%",
                end: "top 10%",
                scrub: 1,
            }
        });

        // The container starts at max-w-[1475px] with margins, then expands to 100vw
        tl.fromTo(
            mediaContainerRef.current,
            {
                width: "100%",
                maxWidth: "1475px",
                borderRadius: "24px",
            },
            {
                width: "100vw",
                maxWidth: "100vw",
                borderRadius: "0px",
                ease: "none"
            }
        );

        // Subtly scale the image inside for a parallax/expansion feel
        tl.fromTo(
            mediaInnerRef.current,
            { scale: 1.1 },
            { scale: 1, ease: "none" },
            0
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full overflow-hidden bg-white pt-[15vh] pb-32">
            {/* Top Text Content */}
            <div className="max-w-[1475px] mx-auto px-6 md:px-16 w-full flex flex-col mb-16 md:mb-24">
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

            {/* Expanding Media Container */}
            <div className="w-full flex justify-center px-6 md:px-16">
                <div
                    ref={mediaContainerRef}
                    className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden will-change-[width,border-radius]"
                >
                    <div ref={mediaInnerRef} className="absolute inset-0 w-full h-full will-change-transform">
                        <Image
                            src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2053&auto=format&fit=crop"
                            alt="Cosmetic product visual placeholder"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
