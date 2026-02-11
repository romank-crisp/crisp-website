"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { clsx } from "clsx";

import { locations as LOCATIONS } from "@/content/locations";

export function LocationsMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Initial State
        gsap.set(".location-dot", { scale: 0, opacity: 0 });
        gsap.set(".location-label", { y: 10, opacity: 0 });
        gsap.set(".city-list", { opacity: 0, scale: 0.8, y: -10 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
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
        }, "-=0.8");

        // Reveal Labels
        tl.to(".location-label", {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: {
                amount: 0.6,
                from: "random"
            },
            ease: "power2.out"
        }, "-=0.6");

        // Subtle shake/jitter on dots
        tl.add(() => {
            gsap.utils.toArray(".location-dot").forEach((dot: any) => {
                gsap.to(dot, {
                    x: "random(-1, 1)",
                    y: "random(-1, 1)",
                    duration: gsap.utils.random(0.1, 0.3),
                    repeat: -1,
                    yoyo: true,
                    ease: "none"
                });
            });
        }, "-=0.5");

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

    }, { scope: containerRef });

    // Handle cursor movement for magnetic effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setCursorPos({ x, y });

        // Apply magnetic effect to all dots based on cursor position
        LOCATIONS.forEach(loc => {
            const dx = x - loc.x;
            const dy = y - loc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Magnetic effect within 30% distance - dots move TOWARD cursor
            if (distance < 30) {
                const strength = 0.25; // Attraction strength
                const magnetX = dx * strength;
                const magnetY = dy * strength;

                gsap.to(`[data-location-id="${loc.id}"]`, {
                    x: magnetX,
                    y: magnetY,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                // Reset if too far
                gsap.to(`[data-location-id="${loc.id}"]`, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
    };

    const handleMouseLeave = () => {
        setCursorPos(null);
        // Reset all dots when cursor leaves
        gsap.to(".location-container", {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    // Magnetic effect on hover
    const handleDotHover = (targetId: string, isEntering: boolean) => {
        setHoveredLocation(isEntering ? targetId : null);

        if (!isEntering) {
            // Reset all dots to original positions
            gsap.to(".location-container", {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
            return;
        }

        // Find the hovered location
        const hoveredLoc = LOCATIONS.find(loc => loc.id === targetId);
        if (!hoveredLoc) return;

        // Animate nearby dots toward the hovered one
        LOCATIONS.forEach(loc => {
            if (loc.id === targetId) return;

            // Calculate distance
            const dx = hoveredLoc.x - loc.x;
            const dy = hoveredLoc.y - loc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only magnetize if within a certain range
            if (distance < 50) {
                const strength = 0.35;
                const magnetX = dx * strength;
                const magnetY = dy * strength;

                gsap.to(`[data-location-id="${loc.id}"]`, {
                    x: magnetX,
                    y: magnetY,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    };

    return (
        <section ref={containerRef} className="w-full relative z-10 select-none -mt-32 md:-mt-48 pointer-events-none bg-text py-32 md:py-48">
            <div
                className="max-w-[1440px] mx-auto px-6 md:px-12 relative h-[500px] w-full pointer-events-auto"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Locations Layer */}
                {LOCATIONS.map((loc) => (
                    <div
                        key={loc.id}
                        data-location-id={loc.id}
                        className="location-container absolute flex flex-col items-center group cursor-pointer"
                        style={{
                            left: `${loc.x}%`,
                            top: `${loc.y}%`,
                            transform: "translate(-50%, -50%)"
                        }}
                        onMouseEnter={() => handleDotHover(loc.id, true)}
                        onMouseLeave={() => handleDotHover(loc.id, false)}
                    >
                        {/* Dot Component */}
                        <div className="relative mb-3 group-hover:scale-110 transition-transform duration-300">
                            {/* Hover Pulse Ring */}
                            <div className={clsx(
                                "absolute inset-0 -m-4 rounded-full border border-brand/50 opacity-0 scale-50 transition-all duration-500",
                                hoveredLocation === loc.id && "animate-ping opacity-100 scale-150"
                            )} />

                            {/* Main Dot */}
                            <div className="location-dot w-2 h-2 md:w-3 md:h-3 rounded-full bg-brand" />
                        </div>

                        {/* Label */}
                        <div className="location-label mt-4">
                            <div className="flex flex-col items-center gap-3">
                                <h3 className={clsx(
                                    "font-heading text-h3 whitespace-nowrap transition-all duration-300 text-center",
                                    hoveredLocation === loc.id
                                        ? "text-white opacity-100 scale-110"
                                        : hoveredLocation
                                            ? "text-white/20 blur-[1px]"
                                            : "text-white/40"
                                )}>
                                    {loc.label}
                                </h3>

                                {/* Cities - Show on hover */}
                                {loc.cities && hoveredLocation === loc.id && (
                                    <div className="city-list flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {loc.cities.map((city) => (
                                            <div key={city} className="font-text text-text-sm text-white/20 whitespace-nowrap text-center">
                                                {city}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
