"use client";

import { TeamAccordion } from "@/components/blocks/TeamAccordion";
import { ClientLogos } from "@/components/blocks/ClientLogos";
import { HeroHorizontalScroll } from "@/components/blocks/HeroHorizontalScroll";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Horizontal Scroll Hero Section */}
            <HeroHorizontalScroll />

            {/* Client Logos Section */}
            <ClientLogos />

            {/* Team Accordion Section */}
            <TeamAccordion />
        </main>
    );
}
