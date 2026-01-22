"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    text: string;
    className?: string;
}

export function TextReveal({ text, className }: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const words = useMemo(() => text.split(" "), [text]);

    useGSAP(() => {
        if (!containerRef.current) return;

        const wordElements = containerRef.current.querySelectorAll(".reveal-word");

        gsap.from(wordElements, {
            y: "110%",
            opacity: 0,
            duration: 0.8,
            stagger: 0.015,
            ease: "power2.out",
            overwrite: "auto",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 95%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: containerRef, dependencies: [text] });

    return (
        <div
            ref={containerRef}
            className={className}
        >
            {words.map((word, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        overflow: "hidden",
                        verticalAlign: "bottom",
                        marginRight: "0.25em"
                    }}
                >
                    <span
                        className="reveal-word"
                        style={{
                            display: "inline-block",
                            willChange: "transform, opacity"
                        }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </div>
    );
}
