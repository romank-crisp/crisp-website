"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { clsx } from "clsx";

interface TextInsertProps {
    title?: string;
    children: React.ReactNode;
    type?: "editorial" | "quote" | "stats";
    className?: string;
}

export function TextInsert({ title, children, type = "editorial", className }: TextInsertProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(containerRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            },
        });
    }, { scope: containerRef });

    if (type === "quote") {
        return (
            <div ref={containerRef} className={clsx("py-24 md:py-32 px-6 will-change-transform", className)}>
                <blockquote className="max-w-4xl mx-auto text-center">
                    <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight font-display text-accent">
                        "{children}"
                    </p>
                    {title && <footer className="mt-8 text-sm uppercase tracking-widest opacity-60 font-body">— {title}</footer>}
                </blockquote>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={clsx("py-16 md:py-24 px-6 max-w-[1600px] mx-auto will-change-transform", className)}>
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
                {title && (
                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide border-t border-black/10 pt-4 text-accent">
                            {title}
                        </h3>
                    </div>
                )}
                <div className={clsx("md:col-span-8 lg:col-span-8 prose prose-lg prose-gray text-black/80 font-light", !title && "md:col-start-5")}>
                    {children}
                </div>
            </div>
        </div>
    );
}
