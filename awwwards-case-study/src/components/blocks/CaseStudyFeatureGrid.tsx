"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeatureGridProps } from "@/types/case-study";

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%",
                },
            }
        );
    }, []);

    return (
        <div
            ref={cardRef}
            className="bg-[#F5F5F5] p-8 rounded-2xl flex flex-col justify-between h-full hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#E8E8E8]"
        >
            <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-medium text-black leading-tight italic">
                    &quot;{title}&quot;
                </h3>
                <p className="text-black/60 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export function CaseStudyFeatureGrid({ title, subtitle, features }: FeatureGridProps) {
    return (
        <div className="bg-white py-24 md:py-32">
            {(title || subtitle) && (
                <div className="max-w-[1475px] mx-auto mb-16 px-16 md:px-64">
                    {title && <h2 className="text-3xl md:text-5xl font-medium mb-4">{title}</h2>}
                    {subtitle && <p className="text-black/60 text-lg">{subtitle}</p>}
                </div>
            )}
            <div className="max-w-[1475px] mx-auto px-16 md:px-64">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} title={feature.title} description={feature.description} />
                    ))}
                </div>
            </div>
        </div>
    );
}
