"use client";

import { useRef, ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextFormatter } from "@/components/ui/TextFormatter";

gsap.registerPlugin(ScrollTrigger);

interface WorksStepsProps {
    steps: string[];
    /** Optional background layer (e.g. PhysicsPills) rendered behind content */
    background?: ReactNode;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export const WorksSteps: React.FC<WorksStepsProps> = ({ steps, background }) => {
    const headingRef = useRef<HTMLDivElement>(null);

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
                    trigger: headingRef.current,
                    start: "top 85%",
                }
            }
        );
    }, { scope: headingRef });

    return (
        <section className="w-full relative px-6 md:px-12 pt-[10vh] pb-[40vh] max-w-[1440px] mx-auto">
            {/* Optional background layer */}
            {background && (
                <div className="absolute inset-0 w-full h-full">
                    {background}
                </div>
            )}

            {/* Foreground content */}
            <div className="relative z-10">
                {/* Mega Heading — "Design matters. Craft what endures." */}
                <div ref={headingRef} className="mb-20 md:mb-28">
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

                {/* Steps Grid */}
                {steps && steps.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-x-12 md:gap-y-16"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {steps.map((stepText, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-start text-left"
                                variants={itemVariants}
                            >
                                {/* Circle Number */}
                                <div className="min-w-[48px] min-h-[48px] md:min-w-[56px] md:min-h-[56px] p-3 rounded-full border border-gray-300 flex items-center justify-center font-text text-lg md:text-xl font-medium text-gray-800 mb-8 shrink-0 inline-flex">
                                    {index + 1}
                                </div>
                                {/* Text Content */}
                                <p className="font-text text-xl md:text-2xl text-text leading-snug whitespace-pre-wrap">
                                    <TextFormatter text={stepText} />
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};
