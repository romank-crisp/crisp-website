"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";
import { TextFormatter } from "@/components/ui/TextFormatter";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface AIVisualTextIterationProps {
    texts: string[];
    className?: string;
}

export function AIVisualTextIteration({ texts, className }: AIVisualTextIterationProps) {
    // Outer section: tall scroll area (CSS controls height, not GSAP)
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!sectionRef.current || texts.length === 0) return;

        // Initial state: only first text visible
        textRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, i === 0
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 40, scale: 1.05 }
            );
        });

        const steps = texts.length - 1;
        const stepDuration = 1;

        // Timeline scrubbed by scroll — NO pin (CSS sticky handles that)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",   // covers the full height of the section
                scrub: 1,
            }
        });

        for (let i = 0; i < steps; i++) {
            const current = textRefs.current[i];
            const next = textRefs.current[i + 1];
            if (!current || !next) continue;

            const offset = i * stepDuration;

            tl.to(current, {
                y: -20,
                opacity: 0,
                scale: 0.95,
                duration: stepDuration,
                ease: "power2.inOut",
            }, offset);

            tl.to(next, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: stepDuration,
                ease: "power2.inOut",
            }, offset);
        }

    }, { scope: sectionRef, dependencies: [texts] });

    if (!texts || texts.length === 0) return null;

    return (
        // Outer: 250vh scroll area — 100vh visible + 150vh scroll budget
        <section
            ref={sectionRef}
            className={clsx("w-full bg-white relative", className)}
            style={{ height: "250vh" }}
        >
            {/* CSS sticky — stays at top for the full 250vh, no GSAP pin needed */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Wrapper keeps heading + text as a vertically centered group */}
                <div className="flex flex-col items-center">
                    {/* Fixed sub-heading above the text animation */}
                    <h4 className="font-heading text-h4 text-brand tracking-wider mb-10 uppercase z-10">
                        THE PROBLEM
                    </h4>
                    <div className="relative w-[50vw] mx-auto px-6 md:px-16" style={{ minHeight: 160 }}>
                        {texts.map((text, i) => (
                            <div
                                key={i}
                                ref={(el) => { textRefs.current[i] = el; }}
                                className="absolute inset-0 w-full flex items-start justify-center text-center will-change-transform"
                            >
                                <h1 className="font-heading text-h1 leading-[1.1] mx-auto text-text text-center">
                                    <TextFormatter text={text} />
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
