"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TimelineData, TimelineStep } from "@/content/services";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { TextFormatter } from "@/components/ui/TextFormatter";

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

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

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
            onComplete: () => { gsap.set(el, { height: "auto" }); ScrollTrigger.refresh(); },
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

    // Desktop only: scroll-activated accordion
    useEffect(() => {
        if (isMobile) return;
        const stepCount = data?.steps?.length ?? 0;
        setExpandedSet(prev => {
            const next = new Set(prev);
            if (activeIndex < stepCount && !next.has(activeIndex)) {
                next.add(activeIndex);
                expandPanel(activeIndex);
            }
            for (let i = 0; i < activeIndex; i++) {
                if (next.has(i)) {
                    next.delete(i);
                    collapsePanel(i);
                }
            }
            return next;
        });
    }, [activeIndex, collapsePanel, expandPanel, data?.steps?.length, isMobile]);

    // Desktop only: GSAP ScrollTriggers
    useGSAP(() => {
        if (isMobile) return;
        if (!containerRef.current || !data?.steps?.length) return;

        blocksRef.current.forEach((block, index) => {
            if (!block) return;
            ScrollTrigger.create({
                trigger: block,
                start: "top 40%",
                end: "bottom 40%",
                onEnter: () => setActiveIndex(index),
                onEnterBack: () => setActiveIndex(index),
            });
        });

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
    }, { scope: containerRef, dependencies: [data, isMobile] });

    if (!data?.steps?.length) return null;

    // ── Mobile: simple static accordion (no GSAP, no sticky, no spacers) ──
    if (isMobile) {
        return (
            <section className="w-full bg-white pt-[160px] pb-0">
                <div className="max-w-[1475px] mx-auto px-6">
                    <h2
                        className="font-mega text-mega-h2 uppercase text-text max-w-[900px] mb-24"
                        dangerouslySetInnerHTML={{ __html: data.sectionTitle }}
                    />

                    <div className="flex flex-col border-t border-gray-200">
                        {data.steps.map((step, i) => {
                            const isExpanded = expandedSet.has(i);
                            return (
                                <div
                                    key={step.id}
                                    className="border-b border-gray-200 last:border-b-0 cursor-pointer"
                                    onClick={() => {
                                        setExpandedSet(prev => {
                                            const next = new Set(prev);
                                            if (next.has(i)) {
                                                next.delete(i);
                                            } else {
                                                next.add(i);
                                            }
                                            return next;
                                        });
                                    }}
                                >
                                    <div className="py-[32px] flex flex-col gap-2">
                                        <span className="font-heading font-bold text-h3 text-brand whitespace-nowrap">
                                            {step.day}
                                        </span>
                                        <h3 className="font-heading text-h3 text-text">
                                            {step.title}
                                        </h3>

                                        {/* Collapsible body — pure CSS transition on mobile */}
                                        <div
                                            className="overflow-hidden transition-all duration-500"
                                            style={{
                                                maxHeight: isExpanded ? "500px" : "0px",
                                                opacity: isExpanded ? 1 : 0,
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="pt-[24px] pb-4">
                                                <ul className="space-y-4 w-full">
                                                    {(step.list || [step.description]).map((listItem, listIndex) => (
                                                        <li key={listIndex} className="flex items-start gap-4 w-full">
                                                            <div className="shrink-0 mt-[9px]">
                                                                <ArrowRight className="w-5 h-5 text-brand" />
                                                            </div>
                                                            <p className="font-text text-text-sm text-text/70 leading-relaxed text-left m-0 flex-1">
                                                                <TextFormatter text={listItem} />
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
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

    // ── Desktop: full GSAP sticky + scroll-activated timeline ──
    return (
        <section ref={containerRef} className="w-full bg-white pt-[160px] pb-0">
            <div className="max-w-[1475px] mx-auto px-6 md:px-16">

                {/* Sticky Title */}
                <h2
                    className="sticky top-[10vh] z-0 font-mega text-mega-h2 uppercase text-text max-w-[900px] pl-[5px] mb-24 md:mb-48 bg-white"
                    dangerouslySetInnerHTML={{ __html: data.sectionTitle }}
                />

                <div className="relative">

                    {/* Sticky Accordion */}
                    <div className="sticky top-[10vh] z-10 bg-white w-full">
                        <div className="flex flex-col border-t justify-start border-gray-200 bg-white pt-4">
                            {data.steps.map((step, i) => (
                                <div
                                    key={step.id}
                                    className="bg-white border-b border-gray-200 last:border-b-0 cursor-pointer"
                                    onClick={() => {
                                        setExpandedSet(prev => {
                                            const next = new Set(prev);
                                            if (next.has(i)) {
                                                next.delete(i);
                                                collapsePanel(i);
                                            } else {
                                                next.add(i);
                                                expandPanel(i);
                                            }
                                            return next;
                                        });
                                    }}
                                >
                                    <div className="py-[48px] flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                                        <div className="w-[200px] shrink-0">
                                            <span className={clsx(
                                                "font-heading font-bold text-h2 transition-colors duration-700 whitespace-nowrap",
                                                expandedSet.has(i) || activeIndex >= i ? "text-brand" : "text-gray-300"
                                            )}>
                                                {step.day}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className={clsx(
                                                "font-heading text-h2 transition-colors duration-700",
                                                expandedSet.has(i) || activeIndex >= i ? "text-text" : "text-gray-300"
                                            )}>
                                                {step.title}
                                            </h3>

                                            {/* Collapsible body */}
                                            <div
                                                ref={(el) => { contentsRef.current[i] = el; }}
                                                className="overflow-hidden cursor-default"
                                                style={{ height: "auto", opacity: 1 }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="pt-[48px] pb-4">
                                                    <ul className="space-y-4 w-full md:w-[60%]">
                                                        {(step.list || [step.description]).map((listItem, listIndex) => (
                                                            <li key={listIndex} className="flex items-start gap-4 w-full">
                                                                <div className="shrink-0 mt-[9px]">
                                                                    <ArrowRight className="w-5 h-5 text-brand" />
                                                                </div>
                                                                <p className="font-text text-text-md text-text/70 leading-relaxed text-left m-0 flex-1">
                                                                    <TextFormatter text={listItem} />
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invisible spacers */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col">
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

                    {/* Height setter */}
                    <div style={{ height: `${data.steps.length * 90}vh` }} />

                </div>

            </div>
        </section>
    );
}
