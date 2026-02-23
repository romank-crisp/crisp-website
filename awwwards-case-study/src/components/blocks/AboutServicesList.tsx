"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tag } from "@/components/ui/Tag";
import { ServicesData } from "@/content/services";
import { useContactForm } from "@/context/ContactFormContext";
import Lottie from "lottie-react";
import { TextFormatter } from "@/components/ui/TextFormatter";
import { useEffect } from "react";
import { getAssetUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const serviceAnimations = [
    getAssetUrl("/img/about-services-branding.json"),
    getAssetUrl("/img/about-services-web.json"),
    getAssetUrl("/img/about-services-conten.json")
];

function DynamicLottie({ url, fallback }: { url?: string, fallback: any }) {
    const [data, setData] = useState<any>(typeof fallback !== 'string' ? fallback : null);

    useEffect(() => {
        const fetchUrl = url || (typeof fallback === 'string' ? fallback : null);
        if (fetchUrl) {
            fetch(fetchUrl).then(r => r.json()).then(setData).catch(() => {
                if (typeof fallback !== 'string') setData(fallback);
            });
        } else {
            setData(fallback);
        }
    }, [url, fallback]);

    if (!data) return null;
    return <Lottie animationData={data} loop={true} />;
}

export const AboutServicesList = ({ data }: { data: ServicesData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const desktopContainerRef = useRef<HTMLDivElement>(null);
    const finaleRef = useRef<HTMLDivElement>(null);
    const blocksRef = useRef<(HTMLDivElement | null)[]>([]);

    // For mobile accordion
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
    // For desktop scrolling
    const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);
    const [isPastEnd, setIsPastEnd] = useState(false);

    const { openContactForm } = useContactForm();

    // Fallback: If cache returns array, treat it as items. If object, grab title and items.
    const items = Array.isArray(data) ? data : data?.items || [];
    const title = Array.isArray(data) ? ["OUR", "CAPABILITIES"] : data?.title || ["OUR", "CAPABILITIES"];

    useGSAP(() => {
        if (!containerRef.current) return;

        // Text Mask Animation for "OUR CAPABILITIES"
        const textElements = containerRef.current.querySelectorAll(".services-title-word");

        if (textElements.length > 0) {
            gsap.fromTo(textElements,
                { y: "110%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "circ.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        end: "top 30%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Setup scroll triggers for desktop layout to sync active tab
        blocksRef.current.forEach((block, index) => {
            if (block) {
                const isLast = index === items.length - 1;
                ScrollTrigger.create({
                    trigger: block,
                    start: "top center",
                    end: "bottom center",
                    onToggle: (self) => {
                        if (self.isActive) {
                            setDesktopActiveIndex(index);
                            if (isLast) setIsPastEnd(false);
                        }
                    },
                    onLeave: () => {
                        if (isLast) setIsPastEnd(true);
                    }
                });
            }
        });

    }, { scope: containerRef });

    const scrollToBlock = (index: number) => {
        setDesktopActiveIndex(index);
        const block = blocksRef.current[index];
        if (block) {
            block.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <section ref={containerRef} className="w-full pt-48 md:pt-64 pb-[100px] text-white relative z-10">
            <div className="max-w-[1400px] mx-auto">
                <h2 className="font-mega text-mega-h2 uppercase mb-16 md:mb-32 text-brand flex flex-wrap gap-x-[0.2em]">
                    {title.map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden">
                            <span className="services-title-word inline-block translate-y-[110%] opacity-0">
                                {word}
                            </span>
                        </span>
                    ))}
                </h2>

                {/* Desktop Layout */}
                <div ref={desktopContainerRef} className="hidden lg:flex items-start gap-48 relative">

                    {/* Left Column: Navigation Tabs — sticky position */}
                    <div className="w-[360px] shrink-0 flex flex-col gap-10 sticky top-[30vh]">
                        {items.map((service, index) => (
                            <button
                                key={service.id}
                                onClick={() => scrollToBlock(index)}
                                className={clsx(
                                    "font-heading text-h1 transition-all duration-300 text-left w-full",
                                    desktopActiveIndex === index && !(isPastEnd && index === items.length - 1)
                                        ? "opacity-100 translate-x-4"
                                        : "opacity-30 hover:opacity-100 hover:translate-x-2"
                                )}
                                style={
                                    desktopActiveIndex === index && !(isPastEnd && index === items.length - 1)
                                        ? { color: "rgb(var(--color-brand))" }
                                        : undefined
                                }
                            >
                                {service.label}
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Scrollable Service Blocks + Finale Physics Container */}
                    <div className="w-[70%] min-w-0 flex flex-col z-0">
                        {/* Service Blocks with huge gaps to enforce scrolling */}
                        <div className="flex flex-col gap-[5vh] mb-0">
                            {items.map((service, index) => (
                                <div
                                    key={service.id}
                                    ref={el => { blocksRef.current[index] = el; }}
                                    className="relative flex items-center w-full min-h-[25vh] py-[2vh]"
                                >
                                    {/* Sub-Column Left: Lottie */}
                                    <div className="w-[50%] relative z-10 mix-blend-screen opacity-90 pointer-events-none -ml-16">
                                        <DynamicLottie
                                            url={service.animationUrl}
                                            fallback={serviceAnimations[index % serviceAnimations.length]}
                                        />
                                    </div>

                                    {/* Sub-Column Right: Description */}
                                    <div className="w-[50%] relative z-20 pointer-events-none">
                                        <p className="font-text text-text-lg text-white opacity-90 leading-relaxed text-left">
                                            <TextFormatter text={service.description} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Mobile Layout: Accordion (Unchanged behavior basically, just uses mobileActiveIndex) */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {items.map((service, index) => {
                        const isActive = mobileActiveIndex === index;
                        return (
                            <div key={service.id} className="border-b border-white/10 last:border-0">
                                <button
                                    onClick={() => setMobileActiveIndex(isActive ? -1 : index)}
                                    className="w-full py-6 flex items-center justify-between text-left transition-colors duration-300"
                                    style={
                                        isActive
                                            ? { color: "rgb(var(--color-brand))" }
                                            : undefined
                                    }
                                >
                                    <span className={clsx(
                                        "font-heading text-2xl transition-opacity duration-300",
                                        isActive ? "opacity-100" : "opacity-60 text-white"
                                    )}>
                                        {service.label}
                                    </span>
                                    <span className={clsx(
                                        "text-2xl transition-transform duration-300",
                                        isActive ? "rotate-45" : "text-white/40"
                                    )}>
                                        +
                                    </span>
                                </button>

                                <div className={clsx(
                                    "overflow-hidden transition-all duration-500 ease-in-out",
                                    isActive ? "max-h-[800px] opacity-100 pb-0" : "max-h-0 opacity-0"
                                )}>
                                    <div className="flex flex-col gap-6">
                                        <div className="relative w-full rounded-lg overflow-hidden bg-white/5 p-6">
                                            <div className="relative z-20 mb-6">
                                                <p className="font-text text-sm text-white opacity-90 leading-relaxed">
                                                    <TextFormatter text={service.description} />
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 relative z-20">
                                                {service.tags.map((tag: string) => (
                                                    <button key={tag} onClick={() => openContactForm()}>
                                                        <Tag className="border-white/20 text-white hover:bg-white hover:text-black hover:border-white cursor-pointer w-full h-full">
                                                            {tag}
                                                        </Tag>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
