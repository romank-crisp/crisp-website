"use client";

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { Plus } from "lucide-react";
import { TeamMember } from "@/content/team";
import { Tag } from "@/components/ui/Tag";

export const AboutTeamAccordion = ({ data }: { data: TeamMember[] }) => {
    const [openId, setOpenId] = useState<string | null>(null);
    const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Detect reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Track cursor position
    useEffect(() => {
        if (prefersReducedMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("pointermove", handleMouseMove);
        return () => window.removeEventListener("pointermove", handleMouseMove);
    }, [prefersReducedMotion]);

    // Animate preview photo to follow cursor with spring/lag
    useGSAP(() => {
        if (!previewRef.current || !hoveredMember || prefersReducedMotion) return;

        const preview = previewRef.current;
        const rect = preview.getBoundingClientRect();
        const offset = 20; // Offset from cursor

        // Calculate position with viewport clamping
        let targetX = cursorPos.x + offset;
        let targetY = cursorPos.y + offset;

        // Clamp to viewport
        const maxX = window.innerWidth - rect.width - 20;
        const maxY = window.innerHeight - rect.height - 20;

        targetX = Math.max(20, Math.min(targetX, maxX));
        targetY = Math.max(20, Math.min(targetY, maxY));

        // Calculate rotation based on horizontal position
        // Center of viewport = 0°, left edge = -15°, right edge = +15°
        const viewportCenter = window.innerWidth / 2;
        const distanceFromCenter = targetX + (rect.width / 2) - viewportCenter;
        const maxDistance = viewportCenter;
        const rotation = (distanceFromCenter / maxDistance) * 15; // -15 to +15 degrees

        gsap.to(preview, {
            x: targetX,
            y: targetY,
            rotation: rotation,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto"
        });
    }, [cursorPos, hoveredMember, prefersReducedMotion]);

    // Show/hide preview with fade and scale
    useGSAP(() => {
        if (!previewRef.current) return;

        if (hoveredMember && !prefersReducedMotion) {
            gsap.to(previewRef.current, {
                opacity: 1,
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        } else {
            gsap.to(previewRef.current, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                ease: "power2.in",
                overwrite: "auto"
            });
        }
    }, [hoveredMember, prefersReducedMotion]);

    const toggleAccordion = (id: string) => {
        const isOpening = openId !== id;
        const previousId = openId;

        // Close previous panel
        if (previousId && panelRefs.current.has(previousId)) {
            const prevPanel = panelRefs.current.get(previousId)!;
            const prevIcon = iconRefs.current.get(previousId);

            if (prefersReducedMotion) {
                prevPanel.style.height = "0px";
                if (prevIcon) prevIcon.style.transform = "rotate(0deg)";
            } else {
                gsap.to(prevPanel, {
                    height: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                });
                if (prevIcon) {
                    gsap.to(prevIcon, {
                        rotation: 0,
                        duration: 0.5,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                }
            }
        }

        // Open new panel
        if (isOpening && panelRefs.current.has(id)) {
            const panel = panelRefs.current.get(id)!;
            const icon = iconRefs.current.get(id);

            setOpenId(id);

            if (prefersReducedMotion) {
                panel.style.height = "auto";
                if (icon) icon.style.transform = "rotate(45deg)";
            } else {
                // Get auto height
                panel.style.height = "auto";
                const autoHeight = panel.offsetHeight;
                panel.style.height = "0px";

                gsap.to(panel, {
                    height: autoHeight,
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                });
                if (icon) {
                    gsap.to(icon, {
                        rotation: 45,
                        duration: 0.5,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                }
            }
        } else {
            setOpenId(null);
        }
    };

    return (
        <section className="pt-128 pb-64 px-4 md:px-64 bg-white">
            <div className="max-w-[1440px] w-full mx-auto">
                <h2 className="font-mega text-mega-h2 mb-64 uppercase text-brand">
                    Meet the Team
                </h2>

                <div className="space-y-0">
                    {data.filter(member => member.visible).map((member, index) => {
                        const isOpen = openId === member.id;
                        const panelId = `panel-${member.id}`;

                        return (
                            <div
                                key={member.id}
                                className="border-t border-text/10 last:border-b"
                                onMouseEnter={() => !prefersReducedMotion && setHoveredMember(member)}
                                onMouseLeave={() => setHoveredMember(null)}
                            >
                                <button
                                    onClick={() => toggleAccordion(member.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    className="w-full py-24 flex items-center justify-between gap-16 transition-colors focus:outline-none group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-16 flex-grow min-w-0">
                                        <div className="flex items-center gap-4">
                                            <span className="font-heading text-2xl md:text-h1 text-left flex-shrink-0" style={{ color: "var(--color-text)" }}>
                                                {member.name}
                                            </span>
                                            {member.name === "Iryna Chubur" && (
                                                <div className="flex md:hidden items-center">
                                                    <Image
                                                        src="/img/client-logos/client-logo-03-swissprofessionals-small.svg"
                                                        alt="Swiss Professionals"
                                                        width={80}
                                                        height={26}
                                                        className="h-6 w-auto object-contain opacity-60 grayscale"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <span className="font-text text-text-md text-left block truncate" style={{ color: "var(--color-text)", opacity: 0.6 }}>
                                            {member.position}
                                        </span>

                                        {member.name === "Iryna Chubur" && (
                                            <div className="hidden md:flex ml-[100px] items-center self-center">
                                                <Image
                                                    src="/img/client-logos/client-logo-03-swissprofessionals-small.svg"
                                                    alt="Swiss Professionals"
                                                    width={120}
                                                    height={40}
                                                    className="h-10 w-auto object-contain opacity-60 grayscale hover:grayscale-0 transition-all duration-300"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        ref={(el) => {
                                            if (el) iconRefs.current.set(member.id, el);
                                        }}
                                        className="flex items-center justify-center flex-shrink-0 ml-4"
                                    >
                                        <Plus className="w-32 h-32" style={{ color: "var(--color-text)" }} />
                                    </div>
                                </button>

                                <div
                                    id={panelId}
                                    ref={(el) => {
                                        if (el) panelRefs.current.set(member.id, el);
                                    }}
                                    role="region"
                                    aria-labelledby={`button-${member.id}`}
                                    className="overflow-hidden"
                                    style={{ height: 0 }}
                                >
                                    <div className="pb-32 px-0">
                                        <div className="flex flex-col md:flex-row gap-32 md:gap-48">
                                            {/* Photo Column */}
                                            <div className="w-full md:w-[320px] flex-shrink-0 hidden md:block">
                                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
                                                    <Image
                                                        src={member.photo}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, 320px"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Column */}
                                            <div className="flex-grow md:pt-8 md:pr-32">
                                                <p className="font-text text-text-md leading-relaxed mb-24 max-w-3xl" style={{ color: "var(--color-text)", opacity: 0.8 }}>
                                                    {member.bio}
                                                </p>

                                                <div className="flex flex-wrap gap-8">
                                                    {member.tags.map((tag) => (
                                                        <Tag key={tag}>{tag}</Tag>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hover Preview Photo */}
            {!prefersReducedMotion && (
                <div
                    ref={previewRef}
                    className="fixed top-0 left-0 pointer-events-none z-50 opacity-0"
                    style={{
                        width: "clamp(180px, 15vw, 320px)",
                        height: "clamp(240px, 20vh, 400px)",
                    }}
                >
                    {hoveredMember && (
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src={hoveredMember.photo}
                                alt={hoveredMember.name}
                                fill
                                className="object-cover"
                                sizes="220px"
                            />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
