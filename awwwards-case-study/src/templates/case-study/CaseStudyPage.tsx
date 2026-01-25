"use client";

import { useState } from "react";
import { CaseStudyContent } from "@/types/case-study";
import { HeroVideo } from "@/components/blocks/HeroVideo";
import { CaseStudyDetails } from "@/components/blocks/CaseStudyDetails";
import { StatsBlock } from "@/components/blocks/StatsBlock";
import { VideoScrollingCTA } from "@/components/blocks/VideoScrollingCTA";
import { Navbar } from "@/components/layouts/Navbar";

// Dynamically import blocks to avoid circular deps or heavy bundles if needed, 
// but for standard components standard import is fine.
import { TextReveal } from "@/components/blocks/TextReveal";
import { ScrollRevealImage } from "@/components/blocks/ScrollRevealImage";
import { ImageGridHover } from "@/components/blocks/ImageGridHover";
import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { PricingTable } from "@/components/blocks/PricingTable";
import { ContentSplit } from "@/components/blocks/ContentSplit";
import { NextCaseBlock } from "@/components/blocks/NextCaseBlock";
import { LogoAnimation } from "@/components/blocks/LogoAnimation";

interface CaseStudyPageProps {
    content: CaseStudyContent;
}

export function CaseStudyPage({ content }: CaseStudyPageProps) {
    const [isHeroPlaying, setIsHeroPlaying] = useState(false);

    return (
        <main className="min-h-screen bg-white">
            <Navbar isHidden={isHeroPlaying} />

            <HeroVideo
                {...content.hero}
                onPlayChange={setIsHeroPlaying}
            />

            <section className="space-y-64 pt-64 pb-0">
                {content.blocks.map((block) => {
                    switch (block.type) {
                        case "text-reveal":
                            return (
                                <div key={block.id} className="container mx-auto px-16 md:px-32 py-48 md:py-64">
                                    <TextReveal {...block.props} />
                                </div>
                            );
                        case "image-scroll":
                            return (
                                <div key={block.id} className="container mx-auto px-16 md:px-32">
                                    <ScrollRevealImage {...block.props} />
                                </div>
                            );
                        case "image-grid-hover":
                            return (
                                <div key={block.id} className="container mx-auto px-16 md:px-32">
                                    <ImageGridHover {...block.props} />
                                </div>
                            );
                        case "logo-animation":
                            return (
                                <div key={block.id} className="w-full">
                                    <LogoAnimation />
                                </div>
                            );
                        case "grid-2-col":
                            return (
                                <div key={block.id} className="container mx-auto px-16 md:px-32">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                                        <ScrollRevealImage {...block.props.left} />
                                        <ScrollRevealImage {...block.props.right} />
                                    </div>
                                </div>
                            );
                        case "grid-3-col":
                            return (
                                <div key={block.id} className="container mx-auto px-16 md:px-32">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
                                        {block.props.items.map((item, idx) => (
                                            <ScrollRevealImage key={idx} {...item} />
                                        ))}
                                    </div>
                                </div>
                            );
                        case "feature-grid":
                            return <FeatureGrid key={block.id} {...block.props} />;
                        case "process-steps":
                            return <ProcessSteps key={block.id} {...block.props} />;
                        case "pricing-table":
                            return <PricingTable key={block.id} {...block.props} />;
                        case "content-split":
                            return <ContentSplit key={block.id} {...block.props} />;
                        default:
                            return null;
                    }
                })}

                <CaseStudyDetails {...content.details} />

                <StatsBlock {...content.stats} />

                <VideoScrollingCTA />
            </section>

            {content.nextCase && <NextCaseBlock {...content.nextCase} />}
        </main>
    );
}
