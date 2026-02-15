"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tag } from "@/components/ui/Tag";
import { Service } from "@/content/services";

gsap.registerPlugin(ScrollTrigger);

export const AboutServicesList = ({ data }: { data: Service[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

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
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full py-48 md:py-64 text-white relative z-10 mb-32 md:mb-48">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                {/* Mega Title */}
                <h2 className="font-mega text-mega-h2 uppercase mb-32 md:mb-48 text-brand flex flex-wrap gap-x-[0.2em]">
                    {["OUR", "CAPABILITIES"].map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden">
                            <span className="services-title-word inline-block translate-y-[110%] opacity-0">
                                {word}
                            </span>
                        </span>
                    ))}
                </h2>

                {/* Navigation Tabs & Content Grid */}
                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-12 gap-48">

                    {/* Left Column: Navigation Tabs - Sticky in vertical middle */}
                    <div className="col-span-4 flex flex-col gap-8 items-start sticky top-[20vh] self-start">
                        {data.map((service, index) => (
                            <button
                                key={service.id}
                                onClick={() => setActiveIndex(index)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={clsx(
                                    "font-heading text-h1 transition-all duration-300 text-left w-full",
                                    activeIndex === index
                                        ? "opacity-100 translate-x-4"
                                        : "opacity-30 hover:opacity-60"
                                )}
                            >
                                {service.label}
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Content Preview */}
                    <div className="col-span-8 flex flex-col gap-16 relative min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-32 w-full"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[16/10] md:h-[500px] bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                                    <Image
                                        src={data[activeIndex].image}
                                        alt={data[activeIndex].label}
                                        fill
                                        className="object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
                                </div>

                                <div className="flex flex-col gap-32">
                                    {/* Tags Row - Using Tag component from design system */}
                                    <div className="flex flex-wrap gap-8">
                                        {data[activeIndex].tags.map((tag) => (
                                            <Tag key={tag} variant="default">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>

                                    {/* Description - Using text-text-lg from design system */}
                                    <p className="font-text text-text-lg opacity-80 max-w-3xl">
                                        {data[activeIndex].description}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                {/* Mobile Layout: Accordion */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {data.map((service, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <div key={service.id} className="border-b border-white/10 last:border-0">
                                <button
                                    onClick={() => setActiveIndex(isActive ? -1 : index)}
                                    className="w-full py-6 flex items-center justify-between text-left"
                                >
                                    <span className={clsx(
                                        "font-heading text-2xl transition-opacity duration-300",
                                        isActive ? "opacity-100 text-brand" : "opacity-60 text-white"
                                    )}>
                                        {service.label}
                                    </span>
                                    <span className={clsx(
                                        "text-2xl transition-transform duration-300",
                                        isActive ? "rotate-45 text-brand" : "text-white/40"
                                    )}>
                                        +
                                    </span>
                                </button>

                                <div className={clsx(
                                    "overflow-hidden transition-all duration-500 ease-in-out",
                                    isActive ? "max-h-[800px] opacity-100 pb-8" : "max-h-0 opacity-0"
                                )}>
                                    <div className="flex flex-col gap-6">
                                        <div className="relative w-full aspect-video bg-white/5 rounded-lg overflow-hidden">
                                            <Image
                                                src={service.image}
                                                alt={service.label}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {service.tags.map((tag) => (
                                                <Tag key={tag} variant="default" className="text-xs">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>
                                        <p className="font-text text-base text-white/80">
                                            {service.description}
                                        </p>
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
