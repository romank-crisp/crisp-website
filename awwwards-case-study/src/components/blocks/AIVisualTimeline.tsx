"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAssetUrl } from "@/lib/utils";
import { TimelineData, TimelineStep } from "@/content/services";
import { clsx } from "clsx";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface AIVisualTimelineProps {
    data: TimelineData;
}

export function AIVisualTimeline({ data }: AIVisualTimelineProps) {
    const containerRef = useRef<HTMLElement>(null);
    const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
    const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

    const [expandedSet, setExpandedSet] = useState<Set<number>>(
        () => new Set(data.steps?.map((_, i) => i) || [])
    );
    const [activeIndex, setActiveIndex] = useState(0);

    const expandPanel = useCallback((index: number) => {
        const el = contentsRef.current[index];
        if (!el) return;
        const currentH = el.offsetHeight;
        gsap.set(el, { height: "auto", visibility: "hidden" });
        const naturalH = el.scrollHeight;
        gsap.set(el, { height: currentH, visibility: "visible" });
        gsap.to(el, {
            height: naturalH,
            opacity: 1,
            duration: 0.9,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => { gsap.set(el, { height: "auto" }); },
        });
    }, []);

    const collapsePanel = useCallback((index: number) => {
        const el = contentsRef.current[index];
        if (!el) return;
        gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.9,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => { ScrollTrigger.refresh(); },
        });
    }, []);

    useEffect(() => {
        const stepCount = data?.steps?.length ?? 0;
        setExpandedSet(prev => {
            const next = new Set(prev);

            // If activeIndex is within bounds, expand it
            if (activeIndex < stepCount && !next.has(activeIndex)) {
                next.add(activeIndex);
                expandPanel(activeIndex);
            }

            // Collapse all steps before the active one
            for (let i = 0; i < activeIndex; i++) {
                if (next.has(i)) {
                    next.delete(i);
                    collapsePanel(i);
                }
            }

            // If activeIndex is past the last step, also collapse the last step
            if (activeIndex >= stepCount) {
                for (let i = 0; i < stepCount; i++) {
                    if (next.has(i)) {
                        next.delete(i);
                        collapsePanel(i);
                    }
                }
            }

            return next;
        });
    }, [activeIndex, collapsePanel, expandPanel, data?.steps?.length]);

    useGSAP(() => {
        if (!containerRef.current || !data?.steps?.length) return;
        const lastIndex = data.steps.length - 1;

        blocksRef.current.forEach((block, index) => {
            if (!block) return;
            ScrollTrigger.create({
                trigger: block,
                start: "top 40%",
                end: "bottom 40%",
                onEnter: () => setActiveIndex(index),
                onEnterBack: () => setActiveIndex(index),
                // When scrolling past the last spacer, collapse everything
                ...(index === lastIndex && {
                    onLeave: () => setActiveIndex(lastIndex + 1),
                }),
            });
        });

        // Refresh all ScrollTriggers after a frame so downstream
        // components (calculator, team) recalculate their positions
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
    }, { scope: containerRef, dependencies: [data] });

    if (!data?.steps?.length) return null;

    return (
        <section ref={containerRef} className="w-full bg-white pt-[120px]">
            <div className="max-w-[1475px] mx-auto px-6 md:px-16">

                <h2
                    className="font-mega text-mega-h2 uppercase text-text max-w-[900px] pb-24"
                    dangerouslySetInnerHTML={{ __html: data.sectionTitle }}
                />

                {/*
                    KEY LAYOUT FOR STICKY TO WORK:
                    - Outer div is `relative` — this is the scroll container the sticky respects.
                    - Inner accordion div is `sticky top-[150px]` — it pins within this outer div.
                    - The spacer divs inside give the outer div its scroll height.
                    - Once the spacers scroll past, the sticky element naturally unsticks.
                */}
                <div className="relative">

                    {/* Sticky Accordion — pins inside the relative container */}
                    <div className="sticky top-[150px] z-10">
                        <div className="flex flex-col border-t border-gray-200 bg-white">
                            {data.steps.map((step, i) => (
                                <div
                                    key={step.id}
                                    className="bg-white border-b border-gray-200 last:border-b-0"
                                >
                                    {/* Header: always visible */}
                                    <div className="pt-14 pb-14">
                                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                                            <div className="w-[200px] shrink-0">
                                                <span className={clsx(
                                                    "font-heading font-bold text-h2 transition-colors duration-700 whitespace-nowrap",
                                                    expandedSet.has(i) || activeIndex >= i ? "text-brand" : "text-gray-300"
                                                )}>
                                                    {step.day}
                                                </span>
                                            </div>
                                            <h3 className={clsx(
                                                "font-heading text-h2 transition-colors duration-700",
                                                expandedSet.has(i) || activeIndex >= i ? "text-text" : "text-gray-300"
                                            )}>
                                                {step.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Collapsible body */}
                                    <div
                                        ref={(el) => { contentsRef.current[i] = el; }}
                                        className="overflow-hidden"
                                        style={{ height: "auto", opacity: 1 }}
                                    >
                                        <div className="pb-14">
                                            <p className="font-text text-text-md text-text/70 max-w-[875px] mb-12 leading-relaxed">
                                                {step.description}
                                            </p>
                                            {step.images && step.images.length > 0 && (
                                                <TimelineImages images={step.images} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invisible spacers — these set the height of the outer `relative` div
                        so the sticky accordion has room to scroll within it */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col">
                        {/* Top guard — push spacers down past the title */}
                        <div className="shrink-0" style={{ height: "0px" }} />
                        {data.steps.map((_, i) => (
                            <div
                                key={`spacer-${i}`}
                                ref={(el) => { blocksRef.current[i] = el; }}
                                className="w-full"
                                style={{ height: "90vh" }}
                            />
                        ))}
                    </div>

                    {/* Height setter — the total height this section needs to scroll */}
                    <div style={{ height: `${data.steps.length * 90}vh` }} />

                </div>

            </div>
        </section>
    );
}

function TimelineImages({ images }: { images: TimelineStep["images"] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                    <Image
                        src={getAssetUrl(img.src)}
                        alt={img.alt}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ))}
        </div>
    );
}
