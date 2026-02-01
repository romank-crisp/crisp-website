"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProcessStepsProps } from "@/types/case-study";

gsap.registerPlugin(ScrollTrigger);

const ProcessBlock = ({ step, title, description }: { step: string; title: string; description: string }) => {
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            blockRef.current,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: blockRef.current,
                    start: "top 85%",
                },
            }
        );
    }, []);

    return (
        <div ref={blockRef} className="border-t border-black/10 pt-8 pb-12">
            <span className="text-brand font-medium text-sm mb-4 block">{step}</span>
            <h3 className="text-2xl md:text-3xl font-medium mb-4">{title}</h3>
            <p className="text-black/60 max-w-sm">{description}</p>
        </div>
    );
};

export function ProcessSteps({ title, description, steps }: ProcessStepsProps) {
    return (
        <div className="bg-[#F5F5F5] py-24 md:py-32">
            {(title || description) && (
                <div className="max-w-[1475px] mx-auto mb-20 text-center px-16 md:px-0">
                    {title && <h2 className="text-4xl md:text-6xl font-medium mb-6">{title}</h2>}
                    {description && <p className="text-black/60 max-w-2xl mx-auto">{description}</p>}
                </div>
            )}
            <div className="max-w-[1475px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, i) => (
                    <ProcessBlock key={i} step={step.stepLabel} title={step.title} description={step.description} />
                ))}
            </div>
        </div>
    );
}
