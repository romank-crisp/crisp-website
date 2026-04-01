"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TimelineData } from "@/content/services";
import { TextFormatter } from "@/components/ui/TextFormatter";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface AIVisualTimelineProps {
    data: TimelineData;
}

export function AIVisualTimeline({ data }: AIVisualTimelineProps) {
    const containerRef = useRef<HTMLElement>(null);
    const columnsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current || !data?.steps?.length) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%", // starts when scroll reaches the block (lowered from 80%)
            }
        });

        // Animate section title matching AIVisualTimeline style
        tl.fromTo(
            ".timeline-title",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            0
        );

        // Animate the timeline horizontal line
        tl.fromTo(
            ".timeline-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: "power2.inOut", transformOrigin: "left center" },
            0.2
        );

        // Arrow appears slightly before line finishes
        tl.fromTo(
            ".timeline-arrow",
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
            1.0
        );

        // Animate days on the timeline after line is animated
        tl.fromTo(
            ".day-label",
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
            1.2
        );

        // Animate dates/boxes sequentially, drawn out 4 sec
        const columns = columnsRef.current.filter(Boolean);
        if (columns.length > 0) {
            tl.fromTo(
                columns,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 4, stagger: 0.3, ease: "power3.out" },
                1.2
            );
        }

    }, { scope: containerRef, dependencies: [data] });

    if (!data?.steps?.length) return null;

    return (
        <section ref={containerRef} className="w-full bg-white relative py-[120px] lg:py-[160px] min-h-screen flex flex-col justify-center overflow-hidden">
            <div className="w-full max-w-[1475px] mx-auto flex flex-col h-full flex-1 relative px-6 lg:px-0">
                
                {/* Max-width Title Wrapper to align with content on desktop */}
                <div className="w-full text-left relative z-20">
                    <h2
                        className="timeline-title font-mega text-mega-h2 uppercase text-text mb-16 lg:mb-[96px]"
                        dangerouslySetInnerHTML={{ __html: data.sectionTitle }}
                    />
                </div>

                {/* Full Container for Stages & Timeline */}
                <div className="w-full flex flex-col relative flex-1 justify-center z-10">
                    
                    {/* Central Red Timeline Line - Only strictly centered on LG / Desktop */}
                    <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center z-0 w-full max-w-[1200px] pointer-events-none">
                        <div className="timeline-line flex-1 flex items-center h-[10px] origin-left">
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx} className="flex-1 flex items-center h-full relative">
                                    {/* Day Text above segment */}
                                    <div className="absolute bottom-full left-[10px] pb-3 z-20 whitespace-nowrap pointer-events-none">
                                        <h4 className="day-label font-heading text-h4 uppercase text-text/40">Day {idx + 1}</h4>
                                    </div>
                                    <div className="h-[4px] w-full bg-brand" />
                                    {/* 10px vertical segment separator */}
                                    {idx < 4 && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[10px] bg-brand z-10" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="timeline-arrow text-brand flex-shrink-0 ml-[-2px]">
                           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-[2px]">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    {/* Desktop: 12-col Grid. Mobile: Horizontal Swiper */}
                    <div className="flex lg:grid lg:grid-cols-12 overflow-x-auto lg:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory gap-x-4 lg:gap-x-[24px] gap-y-0 lg:grid-rows-2 relative z-10 w-[100vw] lg:w-full flex-1 touch-pan-x -ml-6 lg:ml-0 px-6 lg:px-0">
                        {data.steps.map((step, i) => {
                            // Assign grid span classes based on array index to match diagram:
                            // All blocks should be identical width (span 4):
                            // i=0 (Day 1): cols 1-4 (span 4)
                            // i=1 (Day 2-3): cols 4-7 (span 4)
                            // i=2 (Day 3-4): cols 6-9 (span 4)
                            // i=3 (Day 5): cols 9-12 (span 4)
                            let gridClass = "";
                            const isTop = (i % 2 === 0);

                            if (i === 0) gridClass = "lg:col-start-1 lg:col-span-4";
                            else if (i === 1) gridClass = "lg:col-start-4 lg:col-span-4";
                            else if (i === 2) gridClass = "lg:col-start-7 lg:col-span-4";
                            else if (i === 3) gridClass = "lg:col-start-9 lg:col-span-4";

                            return (
                                <div
                                    key={step.id}
                                    ref={(el) => { columnsRef.current[i] = el; }}
                                    className={`flex flex-col relative flex-shrink-0 w-[85vw] snap-center lg:w-full lg:flex-shrink lg:flex-1 ${gridClass} ${
                                        isTop 
                                            ? 'lg:row-start-1 lg:justify-end lg:pb-[96px]' 
                                            : 'lg:row-start-2 lg:justify-start lg:pt-[96px]'
                                    }`}
                                >
                                    <div className="bg-[#F5F5F5] rounded-[32px] p-[32px] md:p-[48px] flex flex-col relative z-20 w-full hover:bg-gray-200/60 transition-colors h-full lg:h-auto border border-gray-100/50">
                                        <h3 className="font-heading text-h3 md:text-h2 text-text mb-6 md:mb-8 leading-tight">
                                            {step.title}
                                        </h3>

                                        <div className="flex-1 mt-2">
                                            <p className="font-text text-text-md text-text/70 leading-relaxed m-0 text-left">
                                                <TextFormatter text={step.description || ''} />
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Connection Elements to Red Center Line */}
                                    {isTop ? (
                                        <>
                                            {/* Dashed line extending down from grey placeholder */}
                                            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-[0px] w-[2px] h-[96px] border-l-[2px] border-dashed border-brand z-10" />
                                            {/* Red dot exactly on the line */}
                                            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-[12px] h-[12px] rounded-full bg-brand z-20" />
                                        </>
                                    ) : (
                                        <>
                                            {/* Dashed line extending up from grey placeholder */}
                                            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[0px] w-[2px] h-[96px] border-l-[2px] border-dashed border-brand z-10" />
                                            {/* Red dot exactly on the line */}
                                            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[-6px] w-[12px] h-[12px] rounded-full bg-brand z-20" />
                                        </>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile/Tablet Bottom Timeline Line */}
                <div className="flex lg:hidden relative w-full pt-[48px] pb-[48px] overflow-hidden">
                    <div className="flex items-center w-full">
                        <div className="timeline-line flex-1 flex items-center h-[10px] origin-left">
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx} className="flex-1 flex items-center h-full relative">
                                    {/* Day Text above segment */}
                                    <div className="absolute bottom-full left-[10px] pb-3 z-20 whitespace-nowrap pointer-events-none">
                                        <h4 className="day-label font-heading text-base md:text-h4 uppercase text-text/40">Day {idx + 1}</h4>
                                    </div>
                                    <div className="h-[4px] w-full bg-brand" />
                                    {/* 10px vertical segment separator */}
                                    {idx < 4 && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[10px] bg-brand z-10" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="timeline-arrow text-brand flex-shrink-0 ml-[-2px]">
                           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-[2px]">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
