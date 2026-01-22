"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface StatItem {
    value: string;
    label: string;
}

interface StatsBlockProps {
    stats: StatItem[];
}

export function StatsBlock({ stats }: StatsBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".stat-item", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full mt-[5vh] mb-[10vh] border-y border-black/10 py-20 md:py-32 will-change-transform">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-item flex flex-col items-start text-left md:border-l border-black/10 md:first:border-l-0 pl-0 md:pl-12">
                            <span className="text-6xl md:text-[120px] font-display text-accent mb-4 block leading-none">
                                {stat.value}
                            </span>
                            <span className="text-label text-grey uppercase">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
