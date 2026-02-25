"use client";

import { WorksData, WorksPageContent, InfiniteScrollItem } from "@/types/work";
import { WorkCard } from "@/components/ui/WorkCard";
import { PhysicsPills } from "@/components/ui/PhysicsPills";
import { CaseStudyTextReveal } from "@/components/blocks/CaseStudyTextReveal";
import { getAssetUrl } from "@/lib/utils";
import { InfiniteScrollPane } from "@/components/blocks/InfiniteScrollPane";
import { useBrand } from "@/context/BrandContext";
import { useContactForm } from "@/context/ContactFormContext";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientLogo } from "@/content/clients";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WorksSteps } from "@/components/blocks/WorksSteps";

gsap.registerPlugin(ScrollTrigger);

function AnimatedMegaHeading() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".works-mega-word",
            { y: "110%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "circ.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-[1440px] mx-auto px-6 md:px-12 mt-[15vh]">
            <h2 className="font-mega text-mega-h2 text-text uppercase leading-none pt-0 px-[3px] py-[3px] flex flex-col items-start xl:whitespace-nowrap">
                <span className="flex flex-wrap gap-x-[0.25em]">
                    <span className="inline-block overflow-hidden"><span className="works-mega-word inline-block">Design</span></span>
                    <span className="inline-block overflow-hidden"><span className="works-mega-word inline-block">matters.</span></span>
                </span>
                <span className="flex flex-wrap gap-x-[0.25em] text-brand">
                    <span className="inline-block overflow-hidden"><span className="works-mega-word inline-block">Craft</span></span>
                    <span className="inline-block overflow-hidden"><span className="works-mega-word inline-block">what</span></span>
                    <span className="inline-block overflow-hidden"><span className="works-mega-word inline-block">endures.</span></span>
                </span>
            </h2>
        </div>
    );
}

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
    const { openContactForm } = useContactForm();

    // Use passed data or empty array to prevent crashes
    const works = worksData || [];
    const baseTags = [
        "Web Design", "Development", "Branding", "Visual Identity",
        "UX/UI Design", "Content Strategy", "E-commerce", "Animation",
        "Motion Graphics", "3D Design", "Design Systems", "Platform",
        "Copywriting", "SEO", "Art Direction", "Digital Product"
    ];
    // Combine base tags with any unique tags from works, ensuring no duplicates
    const allTags = Array.from(new Set([...baseTags, ...works.flatMap(work => work.tags || [])]))
        .sort(() => Math.random() - 0.5);

    // Fallbacks
    // Fallbacks to empty/safe defaults instead of hardcoded content to enforce JSON source of truth.
    const phrases = content?.heading?.phrases || [];
    const staticText = content?.heading?.staticText || "";
    const title = content?.subheading?.title || "";
    const subItems = content?.subheading?.items || [];
    const bottomText = content?.bottomText || "";
    const spinnerUrl = content?.spinnerUrl || getAssetUrl("/img/spinner-crisp.svg");

    const infiniteScrollItems = useMemo(() => {
        const data = content?.infiniteScroll;
        const fallbackData: InfiniteScrollItem[][] = [
            [
                { id: '1-1', type: "image", width: 800, height: 500, color: "bg-gray-200", label: "image-1", src: getAssetUrl("/img/workspane/pane-01-cardblock.mp4") },
                { id: '1-2', type: "text", width: 700, height: 500, color: "bg-brand", label: "text-1", text: "One dedicated team for copy, design, and marketing. Consistent monthly output with zero management overhead." },
            ]
        ];

        if (!data || data.length === 0) return fallbackData;

        const rowsMap = new Map<number, any[]>();

        data.forEach((item) => {
            const rowNumber = item.row || 1;
            if (!rowsMap.has(rowNumber)) {
                rowsMap.set(rowNumber, []);
            }

            rowsMap.get(rowNumber)!.push({
                ...item,
                id: item.id || `item-${Math.random()}`,
                width: item.width || 600,
                height: item.height || 500,
                src: item.src ? getAssetUrl(item.src) : undefined,
            });
        });

        const sortedRows = Array.from(rowsMap.keys()).sort((a, b) => a - b);
        const mappedRows = sortedRows.map(rowNum => {
            const items = rowsMap.get(rowNum)!;
            return items.sort((a, b) => (a.slot || 0) - (b.slot || 0));
        });

        return mappedRows.length > 0 ? mappedRows : fallbackData;
    }, [content?.infiniteScroll]);

    return (
        <main className="min-h-screen bg-white pt-[15vh]">
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

                {/* Works Grid - Repeated Pattern */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-y-[15vh] md:gap-x-8">
                    {works.map((work, index) => {
                        const patternIndex = index % 3;

                        if (patternIndex === 0) {
                            // Layout A: Left aligned, 6 columns
                            return (
                                <div key={index} className="md:col-span-6">
                                    <WorkCard {...work} />
                                </div>
                            );
                        } else if (patternIndex === 1) {
                            // Layout B: Right aligned, 5 columns, with spinner decor
                            return (
                                <div key={index} className="md:col-span-5 md:col-start-8 relative">
                                    <div className="relative w-full">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[120px] h-[120px] md:w-[200px] md:h-[200px] z-10 pointer-events-none">
                                            <img
                                                src={spinnerUrl}
                                                alt=""
                                                className="w-full h-full object-contain animate-spin"
                                                style={{ animationDuration: '8s' }}
                                            />
                                        </div>
                                        <WorkCard {...work} />
                                    </div>
                                </div>
                            );
                        } else {
                            // Layout C: Full width
                            return (
                                <div key={index} className="md:col-span-12 max-h-[75vh]">
                                    <WorkCard
                                        {...work}
                                        className="h-[75vh]"
                                    />
                                </div>
                            );
                        }
                    })}
                </section>

                <div className="mt-[15vh] mb-[15vh]">
                    <CaseStudyTextReveal
                        text={bottomText}
                        className="font-text text-2xl md:text-4xl text-black leading-tight max-w-4xl"
                    />
                </div>
            </div>

            <InfiniteScrollPane id="infinite-scroll-pane" items={infiniteScrollItems} />

            {/* Mega Heading */}
            <AnimatedMegaHeading />

            {/* Steps Section */}
            <div className="relative w-full mb-[15vh]">
                <WorksSteps steps={content?.steps || []} />
            </div>

            {/* Physics Pills Section */}
            <div className="relative w-full h-[84vh] min-h-[840px] md:h-[42vh] md:min-h-[420px] flex items-center justify-center overflow-hidden mb-0">
                <PhysicsPills
                    tags={allTags}
                    onTagClick={openContactForm}
                />
            </div>
        </main>
    );
}
