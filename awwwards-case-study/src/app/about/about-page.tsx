"use client";

import { AboutTeamAccordion } from "@/components/blocks/AboutTeamAccordion";
import { SharedClientLogos } from "@/components/blocks/SharedClientLogos";
import { AboutPlaneHero } from "@/components/blocks/AboutPlaneHero";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AboutServicesList } from "@/components/blocks/AboutServicesList";
import { SharedVideoScrollingCTA } from "@/components/blocks/SharedVideoScrollingCTA";
import { AboutLocationsMap } from "@/components/blocks/AboutLocationsMap";
import { AboutTeamGallery } from "@/components/blocks/AboutTeamGallery";

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
            start: "top 75%",
            end: "bottom 60%",
            onEnter: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "rgb(var(--color-text))",
                    duration: 0.3,
                    overwrite: "auto"
                });
            },
            onLeave: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "#ffffff",
                    duration: 0.3,
                    overwrite: "auto"
                });
            },
            onEnterBack: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "rgb(var(--color-text))",
                    duration: 0.3,
                    overwrite: "auto"
                });
            },
            onLeaveBack: () => {
                gsap.to(mainRef.current, {
                    backgroundColor: "#ffffff",
                    duration: 0.3,
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
                <SharedClientLogos data={clientsData} />
            </div>
            {/* Wrapper for Dark Mode Sections */}
            <div ref={darkSectionRef} className="relative z-10 pb-[200px] space-y-[100px] md:space-y-[200px]">
                <AboutLocationsMap data={locationsData} />

                {/* Team Gallery - Infinite Scroll */}
                <AboutTeamGallery />
                {/* Services List (Capabilities) */}
                <AboutServicesList data={servicesData} />

            </div>

            {/* Team Accordion Section - White Background */}
            <AboutTeamAccordion data={teamData} />

            {/* Video Scrolling CTA */}
            <SharedVideoScrollingCTA />
        </main>
    );
}
