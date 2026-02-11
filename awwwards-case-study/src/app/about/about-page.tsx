"use client";

import { TeamAccordion } from "@/components/blocks/TeamAccordion";
import { ClientLogos } from "@/components/blocks/ClientLogos";
import { AboutPlaneHero } from "@/components/blocks/AboutPlaneHero";
import { CenteredQuote } from "@/components/blocks/CenteredQuote";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ServicesList } from "@/components/blocks/ServicesList";
import { VideoScrollingCTA } from "@/components/blocks/VideoScrollingCTA";
import { LocationsMap } from "@/components/blocks/LocationsMap";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const mainRef = useRef<HTMLElement>(null);
    const darkSectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!mainRef.current || !darkSectionRef.current) return;

        // Ensure background is explicitly white on mount
        gsap.set(mainRef.current, { backgroundColor: "#ffffff" });

        ScrollTrigger.create({
            trigger: darkSectionRef.current,
            start: "top 60%",
            end: "bottom 60%",
            onEnter: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "rgb(var(--color-text))",
                    duration: 0.6,
                    overwrite: "auto"
                });
            },
            onLeave: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "#ffffff",
                    duration: 0.6,
                    overwrite: "auto"
                });
            },
            onEnterBack: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "rgb(var(--color-text))",
                    duration: 0.6,
                    overwrite: "auto"
                });
            },
            onLeaveBack: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "#ffffff",
                    duration: 0.6,
                    overwrite: "auto"
                });
            }
        });
    }, { scope: mainRef });

    return (
        <main ref={mainRef} className="min-h-screen bg-white transition-colors duration-500">
            {/* Scroll-linked Plane Hero */}
            <AboutPlaneHero />
            {/* Client Logos Section - Transparent BG with spacing */}
            <div className="mt-[100px] mb-[200px]">
                <ClientLogos />
            </div>
            {/* Wrapper for Dark Mode Sections */}
            <div ref={darkSectionRef} className="relative z-10 pb-[200px] space-y-[100px] md:space-y-[200px]">
                {/* Quote Section */}
                <CenteredQuote className="bg-transparent" />

                {/* Interactive Locations Map */}
                <LocationsMap />

                {/* Services List (Capabilities) */}
                <ServicesList />

            </div>

            {/* Team Accordion Section - White Background */}
            <TeamAccordion />

            {/* Video Scrolling CTA */}
            <VideoScrollingCTA />
        </main>
    );
}
