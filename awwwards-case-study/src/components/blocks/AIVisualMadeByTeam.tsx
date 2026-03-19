"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { ArrowRight } from "lucide-react";

import { getAssetUrl } from "@/lib/utils";
import { CaseStudyTextReveal } from "@/components/blocks/CaseStudyTextReveal";
import { TextFormatter } from "@/components/ui/TextFormatter";

export interface MadeByTeamMember {
    name: string;
    src: string;
    position?: string;
}

export interface MadeByTeamData {
    headingLine1: string;
    headingLine2: string;
    description: string;
    team: MadeByTeamMember[];
    listItems?: string[];
    leftColHeader?: string;
    rightColHeader?: string;
}

const DEFAULT_TEAM: MadeByTeamMember[] = [
    { name: "Roman Kovbasyuk", position: "Founder, Head of Design", src: "/img/teampic/portraits/Roma.jpg" },
    { name: "Alina Romashko", position: "Web & Visual Designer", src: "/img/teampic/portraits/Alina.jpg" },
    { name: "Vlad Baranov", position: "Visual Designer", src: "/img/teampic/portraits/Vlad.jpg" },
    { name: "Daria Sobal", position: "Visual Designer", src: "/img/teampic/portraits/Daria.jpg" },
    { name: "Anastasiia Zibla", position: "Project and Client Success", src: "/img/teampic/portraits/Anastasiia Zibla.jpg" },
    { name: "Danil Shepilov", position: "Visual Designer", src: "/img/teampic/portraits/Danyl.jpg" },
];

const WIDTHS = [
    "w-[280px] md:w-[380px]",
    "w-[320px] md:w-[420px]",
    "w-[300px] md:w-[400px]",
    "w-[310px] md:w-[410px]",
    "w-[270px] md:w-[370px]",
    "w-[290px] md:w-[390px]",
];

const DEFAULT_LIST_ITEMS = [
    "Artdirection",
    "AI Model Tooling and chaining",
    "Photo editing",
    "Make it feel real",
];

interface Props {
    data?: MadeByTeamData;
}

export const AIVisualMadeByTeam = ({ data }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const team = data?.team ?? DEFAULT_TEAM;
    const headingLine1 = data?.headingLine1 ?? "Leveraged by AI.";
    const headingLine2 = data?.headingLine2 ?? "Created by experts";
    const leftColHeader = data?.leftColHeader ?? "HUMAN TALENT × AI-CENTRIC WORKFLOWS";
    const rightColHeader = data?.rightColHeader ?? "HOW WE MAKE IT HAPPEN";
    const listItems = data?.listItems ?? DEFAULT_LIST_ITEMS;
    const description =
        data?.description ??
        "You send us guidelines and all the brand assets, and product photos you have. Our team of designers, art directors and AI specialists craft every visual — combining creative expertise with AI-powered tools to deliver consistent, high-quality content at scale.";

    useGSAP(() => {
        if (!containerRef.current || !sliderRef.current) return;

        // Appearance animation
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        const isMobile = window.innerWidth < 768;

        if (!isMobile) {
            // Infinite scroll animation (right to left)
            tweenRef.current = gsap.to(sliderRef.current, {
                xPercent: -50,
                ease: "none",
                duration: 60,
                repeat: -1,
            });
        }
    }, { scope: containerRef });

    // Quadruple images for seamless looping
    const galleryImages = [...team, ...team, ...team, ...team];

    return (
        <section
            ref={containerRef}
            className="w-full relative z-10 overflow-hidden pt-20 md:pt-[120px] pb-0 opacity-0 bg-white text-text flex flex-col items-center"
        >
            {/* Heading */}
            <div className="max-w-[1475px] w-full px-6 md:px-16 mb-12 md:mb-[120px]">
                <h2 className="font-heading text-h2 md:font-mega md:text-mega-h2 uppercase">
                    {headingLine1}
                    <br />
                    <span className="text-brand">
                        {headingLine2}
                    </span>
                </h2>
            </div>

            {/* Gallery */}
            <div className="w-full overflow-x-auto md:overflow-visible select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div
                    ref={sliderRef}
                    className="flex gap-[16px] md:gap-[24px] w-max group hover:cursor-grab active:cursor-grabbing px-6 md:px-0 pb-16 md:pb-0"
                    onMouseEnter={(e) => {
                        if (tweenRef.current) {
                            const x = e.clientX;
                            const width = window.innerWidth;
                            const targetScale = x < width / 2 ? 4.5 : -4.5;
                            gsap.to(tweenRef.current, {
                                timeScale: targetScale,
                                duration: 1.5,
                                ease: "power2.inOut",
                                overwrite: true,
                            });
                        }
                    }}
                    onMouseMove={(e) => {
                        if (tweenRef.current) {
                            const x = e.clientX;
                            const width = window.innerWidth;
                            const targetScale = x < width / 2 ? 4.5 : -4.5;
                            gsap.to(tweenRef.current, {
                                timeScale: targetScale,
                                duration: 1.5,
                                ease: "power2.inOut",
                                overwrite: "auto",
                            });
                        }
                    }}
                    onMouseLeave={() => {
                        if (tweenRef.current) {
                            gsap.to(tweenRef.current, {
                                timeScale: 1,
                                duration: 1.5,
                                ease: "power2.inOut",
                                overwrite: true,
                            });
                        }
                    }}
                >
                    {galleryImages.map((member, index) => (
                        <div
                            key={index}
                            className={`flex flex-col group transition-all duration-500 hover:z-10`}
                        >
                            <div className={`relative ${WIDTHS[index % WIDTHS.length]} h-[420px] md:h-[570px] flex-shrink-0 rounded-[8px] overflow-hidden transition-all duration-500 ease-out group-hover:opacity-80 hover:!opacity-100 hover:scale-[1.02]`}>
                                <Image
                                    src={getAssetUrl(member.src)}
                                    alt={member.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    sizes="(max-width: 768px) 320px, 420px"
                                />
                                {/* Dark gradient overlay — always visible on mobile, hover on desktop */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Info panel — always visible on mobile, hover on desktop */}
                                <div className="absolute inset-x-0 bottom-0 pl-[32px] md:pl-[64px] pb-[32px] md:pb-[64px] pr-8 pt-8 flex flex-col items-start text-left opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                                    <h3 className="font-heading text-h3 text-white mb-1">{member.name}</h3>
                                    {member.position && (
                                        <span className="font-text text-text-sm text-white/90 block truncate">{member.position}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content & List */}
            <div className="max-w-[1475px] w-full px-6 md:px-16 pt-20 pb-20 md:pt-[120px] md:pb-[120px] grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-24">
                <div className="lg:col-span-7 flex flex-col gap-6 md:gap-[48px]">
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider opacity-40">
                        {leftColHeader}
                    </h4>
                    <CaseStudyTextReveal
                        text={description}
                        className="!p-0 !max-w-full font-text text-text-lg md:text-text-2xl text-text leading-[1.4]"
                    />
                </div>
                <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center gap-6 md:gap-[48px]">
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider opacity-40">
                        {rightColHeader}
                    </h4>
                    <ul className="flex flex-col gap-4 md:gap-6 text-text mt-[6px]">
                        {listItems.map((item, index) => (
                            <li key={index} className="flex items-center gap-4">
                                <ArrowRight className="text-brand w-24 h-24 flex-shrink-0" />
                                <h3 className="font-heading text-h4 md:text-h3"><TextFormatter text={item} /></h3>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </section>
    );
};
