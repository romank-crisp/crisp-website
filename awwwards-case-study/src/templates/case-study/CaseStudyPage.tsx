"use client";

import { CaseStudyContent } from "@/types/case-study";
import { CaseStudyHeroVideo } from "@/components/blocks/CaseStudyHeroVideo";
import { CaseStudyDetails } from "@/components/blocks/CaseStudyDetails";
import { SharedStatsBlock } from "@/components/blocks/SharedStatsBlock";
import { CaseStudyTextReveal } from "@/components/blocks/CaseStudyTextReveal";
import { SharedScrollRevealImage } from "@/components/blocks/SharedScrollRevealImage";
import { CaseStudyImageGridHover } from "@/components/blocks/CaseStudyImageGridHover";
import { CaseStudyFeatureGrid } from "@/components/blocks/CaseStudyFeatureGrid";
import { CaseStudyProcessSteps } from "@/components/blocks/CaseStudyProcessSteps";
import { CaseStudyPricingTable } from "@/components/blocks/CaseStudyPricingTable";
import { SharedContentSplit } from "@/components/blocks/SharedContentSplit";
import { CaseStudyNextCaseBlock } from "@/components/blocks/CaseStudyNextCaseBlock";
import { CaseStudyLogoAnimation } from "@/components/blocks/CaseStudyLogoAnimation";
import { CentrogreenDesignCode } from "@/components/blocks/CentrogreenDesignCode";
import { TheyTalkInfluencerBlock } from "@/components/blocks/TheyTalkInfluencerBlock";
import { TheyTalkDesignSystem } from "@/components/blocks/TheyTalkDesignSystem";
import { FolkeuniversitetDesignSystem } from "@/components/blocks/FolkeuniversitetDesignSystem";
import { CaseStudyLottieBlock } from "@/components/blocks/CaseStudyLottieBlock";
import { SharedVideoScrollingCTA } from "@/components/blocks/SharedVideoScrollingCTA";

interface CaseStudyPageProps {
    content: CaseStudyContent;
}

export function CaseStudyPage({ content }: CaseStudyPageProps) {
    return (
        <main className="min-h-screen bg-white">
            <CaseStudyHeroVideo
                {...content.hero}
            />

            <section className="space-y-64 pt-64 pb-0">
                {content.blocks.map((block) => {
                    switch (block.type) {
                        case "text-reveal":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto py-48 md:py-64 px-16 md:px-0">
                                    <CaseStudyTextReveal {...block.props} />
                                </div>
                            );
                        case "image-scroll":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <SharedScrollRevealImage {...block.props} />
                                </div>
                            );
                        case "image-grid-hover":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <CaseStudyImageGridHover {...block.props} />
                                </div>
                            );
                        case "logo-animation":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto py-16 md:py-24">
                                    <CaseStudyLogoAnimation />
                                </div>
                            );
                        case "grid-2-col":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                                        <SharedScrollRevealImage {...block.props.left} mode="intrinsic" className="h-full" />
                                        <SharedScrollRevealImage {...block.props.right} mode="intrinsic" className="h-full" />
                                    </div>
                                </div>
                            );
                        case "grid-3-col":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
                                        {block.props.items.map((item, idx) => (
                                            <SharedScrollRevealImage key={idx} {...item} mode="intrinsic" className="h-full" />
                                        ))}
                                    </div>
                                </div>
                            );
                        case "feature-grid":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <CaseStudyFeatureGrid {...block.props} />
                                </div>
                            );
                        case "process-steps":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <CaseStudyProcessSteps {...block.props} />
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
                                    <CaseStudyPricingTable {...block.props} />
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
                        case "folkeuniversitet-design-system":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <FolkeuniversitetDesignSystem />
                                </div>
                            );
                        case "lottie":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <CaseStudyLottieBlock {...block.props} />
                                </div>
                            );
                        case "content-split":
                            return (
                                <div key={block.id} className="max-w-[1475px] mx-auto">
                                    <SharedContentSplit {...block.props} />
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
                    <SharedStatsBlock {...content.stats} />
                </div>

                <SharedVideoScrollingCTA />
            </section>

            {content.nextCase && <CaseStudyNextCaseBlock {...content.nextCase} />}
        </main>
    );
}
