"use client";

import { WorksData, WorksPageContent } from "@/types/work";
import { WorkCard } from "@/components/ui/WorkCard";
import { SharedClientLogos } from "@/components/blocks/SharedClientLogos";
import { useBrand } from "@/context/BrandContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientLogo } from "@/content/clients";

// Animated Works Heading Component
function AnimatedWorksHeading({ phrases, staticText }: { phrases: string[], staticText: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const dynamicPhrases = phrases.length > 0 ? phrases : [
        "brands that scale.",
        "websites that convert.",
        "robust design systems.",
        "omnichannel content.",
        "rock-solid design."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % dynamicPhrases.length);
        }, 3000); // Slower interval for better readability (2s -> 3s)

        return () => clearInterval(interval);
    }, [dynamicPhrases]);

    const wordVariants = {
        initial: { y: "110%", opacity: 0 },
        animate: {
            y: "0%",
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "circOut" as const
            }
        },
        exit: {
            y: "-110%",
            opacity: 0,
            transition: {
                duration: 0.6,
                ease: "circIn" as const
            }
        }
    };

    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.08
            }
        },
        exit: {
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    return (
        <h1 className="font-mega text-mega-h2 text-text uppercase leading-none text-left min-h-[3em] flex flex-col justify-start">
            <span className="relative block">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentIndex}
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="inline-block"
                    >
                        {dynamicPhrases[currentIndex].split(" ").map((word, i) => (
                            <span key={`${currentIndex}-${i}`} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
                                <motion.span
                                    variants={wordVariants}
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </motion.span>
                </AnimatePresence>
            </span>
            <span className="text-brand">{staticText || "delivered."}</span>
        </h1>
    );
}

export function WorksPage({ clientsData, worksData, content }: { clientsData: ClientLogo[], worksData: WorksData, content?: WorksPageContent }) {
    const { brand } = useBrand();

    // Use passed data or empty array to prevent crashes
    const works = worksData || [];

    // Fallbacks
    const phrases = content?.heading?.phrases || [];
    const staticText = content?.heading?.staticText || "delivered.";
    const title = content?.subheading?.title || "Our Works";
    const subItems = content?.subheading?.items || [
        "Visual Design",
        "Websites",
        "User Experience",
        "Content Design"
    ];

    return (
        <main className="min-h-screen bg-white pt-[15vh] pb-32">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                {/* ... keeping this part unchanged if I don't select it ... */}
                <section className="mb-[15vh] grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 items-center">
                    <div className="md:col-span-8">
                        <h4 className="font-heading text-sm font-bold uppercase tracking-widest mb-4 text-gray-500">
                            {title}
                        </h4>
                        <AnimatedWorksHeading phrases={phrases} staticText={staticText} />
                    </div>

                    <div className="md:col-span-2 md:col-start-11 flex md:justify-end md:-translate-x-[10vw] transform">
                        <div className="font-text text-xl md:text-2xl leading-relaxed text-gray-400">
                            {subItems.map((item, i) => (
                                <p key={i}>{item}</p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Works Grid - 12 Columns */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20 md:mb-32">
                    {/* Card 1: Folkeuniversitetet - 6 columns */}
                    <div className="md:col-span-6">
                        {works[0] && <WorkCard {...works[0]} />}
                    </div>

                    {/* Card 2: TheyTalk - 5 columns in 8-12 range with spinner on left */}
                    <div className="md:col-span-5 md:col-start-8 relative">
                        <div className="relative w-full">
                            {/* Spinner - positioned on left, stacked on top */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[200px] h-[200px] z-10">
                                <img
                                    src="/img/spinner-crisp.svg"
                                    alt="Decoration"
                                    className="w-full h-full object-contain animate-spin"
                                    style={{ animationDuration: '8s' }}
                                />
                            </div>
                            {/* Card */}
                            {works[2] && <WorkCard {...works[2]} />}
                        </div>
                    </div>

                    {/* Card 3: CentroGreen - Full width with max height 75vh */}
                    <div className="md:col-span-12 max-h-[75vh]">
                        {works[1] && (
                            <WorkCard
                                {...works[1]}
                                className="h-[75vh]"
                            />
                        )}
                    </div>
                </section>

            </div >



            {/* Client Logos */}
            <SharedClientLogos data={clientsData} />
        </main >
    );
}
