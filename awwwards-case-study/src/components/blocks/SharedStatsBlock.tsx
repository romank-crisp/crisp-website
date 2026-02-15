"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { StatsBlockProps } from "@/types/case-study";

export const SharedStatsBlock = ({ stats }: { stats: { value: string; label: string }[] }) => {
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
        <div ref={containerRef} className="w-full bg-white py-64 md:py-128 border-y border-text/10 will-change-transform">
            <div className="max-w-[1475px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-32 md:gap-48">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-item flex flex-col items-start text-left min-w-0">
                            <span
                                className="w-full font-mega text-mega-h2 leading-none uppercase text-brand mb-8 block break-words"
                                style={{
                                    WebkitTextStrokeWidth: '4px',
                                    WebkitTextStrokeColor: 'currentColor',
                                }}
                            >
                                {stat.value}
                            </span>
                            <span className="font-heading text-sm font-bold uppercase tracking-wider text-text break-words w-full">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
