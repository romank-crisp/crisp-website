"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { clsx } from "clsx";

import { Location } from "@/content/locations";

export const AboutLocationsMap = ({ data }: { data: Location[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Initial State
        gsap.set(".location-dot", { scale: 0, opacity: 0 });
        gsap.set(".location-label", { y: 10, opacity: 0 });
        gsap.set(".map-connection-line", { strokeDasharray: "2000", strokeDashoffset: "2000", opacity: 0.3 }); // Increased length for long lines
        gsap.set(".city-list", { opacity: 0, scale: 0.8, y: -10 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
                end: "bottom 80%",
            }
        });

        // Pop in Dots
        tl.to(".location-dot", {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: {
                amount: 0.8,
                from: "random",
                ease: "power1.inOut"
            },
            ease: "elastic.out(1, 0.5)"
        });

        // Draw Lines
        tl.to(".map-connection-line", {
            strokeDashoffset: 0,
            duration: 2.0,
            stagger: {
                each: 0.2,
                from: "random"
            },
            ease: "power2.inOut"
        }, "-=0.4");

        // Reveal Labels (Countries)
        tl.to(".location-label", {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: {
                amount: 0.6,
                from: "random"
            },
            ease: "power2.out"
        }, "-=1.5");

        // Enhanced glow effects
        tl.add(() => {
            gsap.utils.toArray(".location-dot").forEach((dot: any) => {
                gsap.to(dot, {
                    filter: "drop-shadow(0 0 12px rgba(var(--color-brand), 0.8))",
                    duration: gsap.utils.random(0.8, 2),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: gsap.utils.random(0, 1.5)
                });
            });
        }, "-=0.5");

        // Text Mask Animation for "Based in EU. Deliver Globally"
        const textElements = containerRef.current.querySelectorAll(".map-title-word");

        if (textElements.length > 0) {
            gsap.fromTo(textElements,
                { y: "110%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "circ.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        end: "top 30%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

    }, { scope: containerRef });

    // Connections to draw
    const CONNECTIONS = [
        ["Switzerland", "Germany"],      // CH-DE
        ["Germany", "Czech Republic"],   // DE-CZ
        ["Czech Republic", "Croatia"],   // CZ-CR
        ["Switzerland", "Croatia"],      // CH-CR
        ["Czech Republic", "Poland"],    // CZ-PL
        ["Poland", "Ukraine"],           // PL-UKR
        ["Ukraine", "Croatia"],          // UKR-CR
        ["Portugal", "Croatia"],         // PT-CR
        ["Portugal", "Switzerland"],     // PT-CH
    ];


    return (
        <section ref={containerRef} className="w-full relative z-10 select-none -mt-32 md:-mt-48 pointer-events-none pt-32 md:pt-48 pb-0">
            {/* Inner Styles for dynamic animations */}
            <style>{`
                @keyframes line-dash {
                    to {
                        stroke-dashoffset: -8;
                    }
                }
                .active-connection {
                    stroke-dasharray: 4 4 !important;
                    animation: line-dash 1s linear infinite;
                    stroke-width: 1 !important;
                    opacity: 0.8 !important;
                }
            `}</style>

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 pointer-events-auto">
                {/* Mega Title */}
                <h2 className="font-mega text-mega-h2 uppercase mb-16 md:mb-32 flex flex-col gap-2">
                    <span className="flex flex-wrap gap-x-[0.2em] text-white">
                        {["Based", "in", "EU."].map((word, i) => (
                            <span key={i} className="inline-block overflow-hidden">
                                <span className="map-title-word inline-block translate-y-[110%] opacity-0">
                                    {word}
                                </span>
                            </span>
                        ))}
                    </span>
                    <span className="flex flex-wrap gap-x-[0.2em] text-brand">
                        {["Deliver", "Globally"].map((word, i) => (
                            <span key={i} className="inline-block overflow-hidden">
                                <span className="map-title-word inline-block translate-y-[110%] opacity-0">
                                    {word}
                                </span>
                            </span>
                        ))}
                    </span>
                </h2>

                {/* Description Text */}
                <p className="font-text text-text-lg text-white/60 w-full md:max-w-[40%] mb-16 md:mb-24 leading-relaxed">
                    Remote design studio building brands, products and websites that teams can ship.
                </p>
            </div>

            <div
                className="max-w-[1440px] mx-auto px-4 md:px-12 relative h-[500px] w-full pointer-events-auto"
            >
                {/* Connection Lines Layer */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                >
                    {CONNECTIONS.map(([start, end], i) => {
                        const s = data.find(l => l.label === start);
                        const e = data.find(l => l.label === end);
                        const isActive = hoveredCountry === start || hoveredCountry === end;

                        if (s && e) {
                            return (
                                <line
                                    key={i}
                                    x1={`${s.x}%`}
                                    y1={`${s.y}%`}
                                    x2={`${e.x}%`}
                                    y2={`${e.y}%`}
                                    stroke="rgb(var(--color-brand))"
                                    strokeWidth="1"
                                    className={clsx(
                                        "map-connection-line transition-all duration-300",
                                        isActive && "active-connection"
                                    )}
                                    strokeLinecap="round"
                                />
                            );
                        }
                        return null;
                    })}
                </svg>

                {/* Locations Layer */}
                {data.map((loc) => (
                    <div
                        key={loc.id}
                        data-location-id={loc.id}
                        className="location-container absolute group cursor-pointer z-20"
                        onMouseEnter={() => setHoveredCountry(loc.label)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        style={{
                            left: `${loc.x}%`,
                            top: `${loc.y}%`,
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        {/* Enlarged Hover Target Area (Hidden) */}
                        <div className="absolute inset-0 -m-12 rounded-full pointer-events-auto" />

                        {/* Dot Wrapper */}
                        <div className="relative flex items-center justify-center w-4 h-4 md:w-6 md:h-6 pointer-events-none">
                            <div className="relative w-full h-full transition-all duration-500 group-hover:scale-125">
                                {/* Main Dot */}
                                <div className="location-dot w-full h-full rounded-full bg-brand shadow-[0_0_20px_rgba(var(--color-brand),0.6)]" />

                                {/* Inner Core */}
                                <div className="absolute inset-[25%] rounded-full bg-[rgb(var(--color-text))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        </div>

                        {/* Text Content (Label & Cities) */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 flex flex-col items-center pointer-events-none">
                            {/* Country Name */}
                            <h3 className="font-heading text-h3 transition-all duration-500 text-center text-white/40 group-hover:text-white group-hover:translate-y-[-4px] group-hover:scale-125 whitespace-nowrap origin-top">
                                {loc.label}
                            </h3>

                            {/* City Pills - Appears on Hover */}
                            {loc.cities && (
                                <div className="mt-4 flex flex-col items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75 pointer-events-none">
                                    {loc.cities.map((city) => (
                                        <div
                                            key={city}
                                            className="font-text text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-brand whitespace-nowrap text-center"
                                        >
                                            {city}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
