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
import { PhysicsPills } from "@/components/ui/PhysicsPills";
import { useContactForm } from "@/context/ContactFormContext";

gsap.registerPlugin(ScrollTrigger);

export const AboutServicesList = ({ data }: { data: Service[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { openContactForm } = useContactForm();

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
            <div className="max-w-[1400px] mx-auto px-16 md:px-64">
                <h2 className="font-mega text-mega-h2 uppercase mb-32 md:mb-48 text-brand flex flex-wrap gap-x-[0.2em]">
                    {["OUR", "CAPABILITIES"].map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden">
                            <span className="services-title-word inline-block translate-y-[110%] opacity-0">
                                {word}
                            </span>
                        </span>
                    ))}
                </h2>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-start gap-48">

                    {/* Left Column: Navigation Tabs — fixed width, sticky */}
                    <div className="w-[360px] shrink-0 flex flex-col gap-8 items-start sticky top-[20vh] self-start">
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

                    {/* Right Column: Physics — flex-1 takes all remaining space */}
                    <div className="flex-1 min-w-0 relative min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {/* Physics Container — description lives inside at top */}
                                <div className="relative w-full h-[625px] rounded-2xl overflow-hidden">
                                    {/* Description overlay — top-left, 64px padding, full width, white */}
                                    <div className="absolute top-0 left-0 z-20 p-[64px] w-full pointer-events-none">
                                        <p className="font-text text-text-lg text-white opacity-90 leading-relaxed w-full">
                                            {data[activeIndex].description}
                                        </p>
                                    </div>
                                    <PhysicsPills
                                        tags={data[activeIndex].tags}
                                        onTagClick={openContactForm}
                                    />
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
                                        {/* Physics Container — description at top */}
                                        <div className="relative w-full aspect-[16/10] md:h-[375px] rounded-lg overflow-hidden">
                                            <div className="absolute top-0 left-0 z-20 p-[32px] pointer-events-none">
                                                <p className="font-text text-sm text-white opacity-90 leading-relaxed">
                                                    {service.description}
                                                </p>
                                            </div>
                                            <PhysicsPills
                                                tags={service.tags}
                                                onTagClick={openContactForm}
                                            />
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
