"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "@/components/ui/Tag";

import { services as SERVICES } from "@/content/services";

export function ServicesList() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="w-full py-48 md:py-64 text-white relative z-10 mb-32 md:mb-48">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                {/* Mega Title */}
                <h2 className="font-mega text-mega-h2 uppercase leading-[0.85] mb-32 md:mb-48">
                    OUR<br />CAPABILITIES
                </h2>

                {/* Navigation Tabs & Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-48">

                    {/* Left Column: Navigation Tabs - Sticky in vertical middle */}
                    <div className="lg:col-span-4 flex flex-col gap-8 items-start sticky top-[20vh] self-start">
                        {SERVICES.map((service, index) => (
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
                    <div className="lg:col-span-8 flex flex-col gap-12 md:gap-16 relative min-h-[600px]">
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
                                        src={SERVICES[activeIndex].image}
                                        alt={SERVICES[activeIndex].label}
                                        fill
                                        className="object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
                                </div>

                                <div className="flex flex-col gap-32">
                                    {/* Tags Row - Using Tag component from design system */}
                                    <div className="flex flex-wrap gap-8">
                                        {SERVICES[activeIndex].tags.map((tag) => (
                                            <Tag key={tag} variant="default">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>

                                    {/* Description - Using text-text-lg from design system */}
                                    <p className="font-text text-text-lg opacity-80 max-w-3xl">
                                        {SERVICES[activeIndex].description}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
