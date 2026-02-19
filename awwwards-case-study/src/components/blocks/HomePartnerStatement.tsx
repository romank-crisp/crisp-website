"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PartnerStatementData } from "@/types/home";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface PartnerStatementProps {
    data: PartnerStatementData;
}

export function HomePartnerStatement({ data }: PartnerStatementProps) {
    const containerRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!headingRef.current) return;

        gsap.fromTo(
            headingRef.current,
            {
                opacity: 0,
                y: 50,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-white py-64 md:py-128">
            <div className="max-w-[1475px] mx-auto px-16 md:px-64">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-32 md:gap-64">
                    {/* Left: Heading */}
                    <h2
                        ref={headingRef}
                        className="font-mega text-mega-h2 leading-none uppercase text-left flex-shrink-0"
                    >
                        <span className="block text-text">{data.heading.line1}</span>
                        <span className="block text-brand">{data.heading.line2}</span>
                    </h2>

                    {/* Right: Description Text */}
                    <div className="font-text text-text-lg text-text max-w-lg -mt-[10px]">
                        <p>
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
