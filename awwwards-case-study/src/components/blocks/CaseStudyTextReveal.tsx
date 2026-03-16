"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tokenizeText } from "@/components/ui/TextFormatter";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    text: string;
    className?: string;
}

export function CaseStudyTextReveal({ text, className }: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tokens = useMemo(() => tokenizeText(text), [text]);

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
            className={`py-16 px-16 md:px-64 max-w-full md:max-w-[65vw] ${className || ''}`}
        >
            {tokens.map((token, tIndex) => {
                let tokenClass = "reveal-word";
                if (token.type === 'dark-gradient') tokenClass += " italic font-serif animate-gradient-text-dark px-1";
                else if (token.type === 'light-gradient') tokenClass += " italic font-serif animate-gradient-text px-1";
                else if (token.type === 'italic') tokenClass += " italic font-serif text-text px-1";

                if (token.type !== 'text') {
                    // Treat the whole phrase as a single block so gradients span correctly
                    // without splitting by string words.
                    return (
                        <span
                            key={tIndex}
                            style={{
                                display: "inline-block",
                                overflow: "hidden",
                                verticalAlign: "bottom",
                                marginRight: "0.25em"
                            }}
                        >
                            <span
                                className={tokenClass}
                                style={{
                                    display: "inline-block",
                                    willChange: "transform, opacity"
                                }}
                            >
                                {token.content}
                            </span>
                        </span>
                    );
                } else {
                    const words = token.content.split(" ").filter(w => w.length > 0);
                    return words.map((word, wIndex) => (
                        <span
                            key={`${tIndex}-${wIndex}`}
                            style={{
                                display: "inline-block",
                                overflow: "hidden",
                                verticalAlign: "bottom",
                                marginRight: "0.25em"
                            }}
                        >
                            <span
                                className={tokenClass}
                                style={{
                                    display: "inline-block",
                                    willChange: "transform, opacity"
                                }}
                            >
                                {word}
                            </span>
                        </span>
                    ));
                }
            })}
        </div>
    );
}
