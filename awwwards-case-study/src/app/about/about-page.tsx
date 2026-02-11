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

import { AboutHeroData } from "@/content/about";
import { ClientLogo } from "@/content/clients";
import { Location } from "@/content/locations";
import { Service } from "@/content/services";
import { TeamMember } from "@/content/team";

gsap.registerPlugin(ScrollTrigger);

interface AboutPageProps {
    aboutData: AboutHeroData;
    clientsData: ClientLogo[];
    locationsData: Location[];
    servicesData: Service[];
    teamData: TeamMember[];
}

export default function AboutPage({ aboutData, clientsData, locationsData, servicesData, teamData }: AboutPageProps) {
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
            <AboutPlaneHero data={aboutData} />
            {/* Client Logos Section - Transparent BG with spacing */}
            <div className="mt-[100px] mb-[200px]">
                <ClientLogos data={clientsData} />
            </div>
            {/* Wrapper for Dark Mode Sections */}
            <div ref={darkSectionRef} className="relative z-10 pb-[200px] space-y-[100px] md:space-y-[200px]">
                {/* Quote Section */}
                <CenteredQuote className="bg-transparent" />

                {/* Interactive Locations Map */}
                <LocationsMap data={locationsData} />

                {/* Services List (Capabilities) */}
                <ServicesList data={servicesData} />

            </div>

            {/* Team Accordion Section - White Background */}
            <TeamAccordion data={teamData} />

            {/* Video Scrolling CTA */}
            <VideoScrollingCTA />
        </main>
    );
}
