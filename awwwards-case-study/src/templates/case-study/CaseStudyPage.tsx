"use client";

import { CaseStudyContent } from "@/types/case-study";
import { HeroVideo } from "@/components/blocks/HeroVideo";
import { CaseStudyDetails } from "@/components/blocks/CaseStudyDetails";
import { StatsBlock } from "@/components/blocks/StatsBlock";
import { TextReveal } from "@/components/blocks/TextReveal";
import { ScrollRevealImage } from "@/components/blocks/ScrollRevealImage";
import { ImageGridHover } from "@/components/blocks/ImageGridHover";
import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { PricingTable } from "@/components/blocks/PricingTable";
import { ContentSplit } from "@/components/blocks/ContentSplit";
import { NextCaseBlock } from "@/components/blocks/NextCaseBlock";
import { LogoAnimation } from "@/components/blocks/LogoAnimation";
import { CentrogreenDesignCode } from "@/components/blocks/CentrogreenDesignCode";
import { TheyTalkInfluencerBlock } from "@/components/blocks/TheyTalkInfluencerBlock";
import { TheyTalkDesignSystem } from "@/components/blocks/TheyTalkDesignSystem";
import { LottieBlock } from "@/components/blocks/LottieBlock";
import { VideoScrollingCTA } from "@/components/blocks/VideoScrollingCTA";

interface CaseStudyPageProps {
    content: CaseStudyContent;
}

export function CaseStudyPage({ content }: CaseStudyPageProps) {
    return (
        <main className="min-h-screen bg-white">
            <HeroVideo
                {...content.hero}
            />

            <section className="space-y-64 pt-64 pb-0">
                {content.blocks.map((block) => {
                    switch (block.type) {
                        case "text-reveal":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto py-48 md:py-64 px-16 md:px-0">
                                    <TextReveal {...block.props} />
                                </div>
                            );
                        case "image-scroll":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <ScrollRevealImage {...block.props} />
                                </div>
                            );
                        case "image-grid-hover":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <ImageGridHover {...block.props} />
                                </div>
                            );
                        case "logo-animation":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto py-16 md:py-24">
                                    <LogoAnimation />
                                </div>
                            );
                        case "grid-2-col":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                                        <ScrollRevealImage {...block.props.left} mode="cover" />
                                        <ScrollRevealImage {...block.props.right} mode="cover" />
                                    </div>
                                </div>
                            );
                        case "grid-3-col":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
                                        {block.props.items.map((item, idx) => (
                                            <ScrollRevealImage key={idx} {...item} mode="cover" />
                                        ))}
                                    </div>
                                </div>
                            );
                        case "feature-grid":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <FeatureGrid {...block.props} />
                                </div>
                            );
                        case "process-steps":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <ProcessSteps {...block.props} />
                                </div>
                            );
                        case "centrogreen-designcode":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <CentrogreenDesignCode />
                                </div>
                            );
                        case "pricing-table":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <PricingTable {...block.props} />
                                </div>
                            );
                        case "theytalk-influencer":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <TheyTalkInfluencerBlock {...block.props} />
                                </div>
                            );
                        case "theytalk-design-system":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <TheyTalkDesignSystem />
                                </div>
                            );
                        case "lottie":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <LottieBlock {...block.props} />
                                </div>
                            );
                        case "content-split":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <ContentSplit {...block.props} />
                                </div>
                            );
                        default:
                            return null;
                    }
                })}

                <div className="max-w-[1475px] mx-auto px-16 md:px-0">
                    <CaseStudyDetails {...content.details} />
                </div>

                <div className="max-w-[1475px] mx-auto px-16 md:px-0">
                    <StatsBlock {...content.stats} />
                </div>

                <VideoScrollingCTA />
            </section>

            {content.nextCase && <NextCaseBlock {...content.nextCase} />}
        </main>
    );
}
