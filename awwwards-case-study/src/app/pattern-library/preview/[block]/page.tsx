export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";

// Block components
import { SharedStatsBlock } from "@/components/blocks/SharedStatsBlock";
import { SharedCenteredQuote } from "@/components/blocks/SharedCenteredQuote";
import { SharedClientLogos } from "@/components/blocks/SharedClientLogos";
import { SharedTestimonials } from "@/components/blocks/SharedTestimonials";
import { SharedFAQ } from "@/components/blocks/SharedFAQ";
import { SharedVideoScrollingCTA } from "@/components/blocks/SharedVideoScrollingCTA";
import { SharedScrollRevealImage } from "@/components/blocks/SharedScrollRevealImage";
import { SharedServicesHero } from "@/components/blocks/SharedServicesHero";
import { SharedContactForm } from "@/components/blocks/SharedContactForm";
import { SharedContentSplit } from "@/components/blocks/SharedContentSplit";
import { HomeWhereWeCanHelp } from "@/components/blocks/HomeWhereWeCanHelp";
import { HomePartnerStatement } from "@/components/blocks/HomePartnerStatement";
import { HomeAnimatedText } from "@/components/blocks/HomeAnimatedText";
import { HomeHorizontalMasonry } from "@/components/blocks/HomeHorizontalMasonry";
import { WorksInfiniteScrollPane } from "@/components/blocks/WorksInfiniteScrollPane";
import { AboutPlaneHero } from "@/components/blocks/AboutPlaneHero";
import { AboutServicesList } from "@/components/blocks/AboutServicesList";
import { AboutLocationsMap } from "@/components/blocks/AboutLocationsMap";
import { AboutTeamAccordion } from "@/components/blocks/AboutTeamAccordion";
import { AboutTeamGallery } from "@/components/blocks/AboutTeamGallery";
import { CaseStudyTextReveal } from "@/components/blocks/CaseStudyTextReveal";
import { CaseStudyHeroVideo } from "@/components/blocks/CaseStudyHeroVideo";
import { CaseStudyDetails } from "@/components/blocks/CaseStudyDetails";
import { CaseStudyImageGridHover } from "@/components/blocks/CaseStudyImageGridHover";
import { CaseStudyLogoAnimation } from "@/components/blocks/CaseStudyLogoAnimation";
import { CaseStudyLottieBlock } from "@/components/blocks/CaseStudyLottieBlock";
import { CaseStudyNextCaseBlock } from "@/components/blocks/CaseStudyNextCaseBlock";
import { CaseStudyTextInsert } from "@/components/blocks/CaseStudyTextInsert";
import { WorksSteps } from "@/components/blocks/WorksSteps";
import { CentrogreenDesignCode } from "@/components/blocks/CentrogreenDesignCode";
import { TheyTalkDesignSystem } from "@/components/blocks/TheyTalkDesignSystem";
import { TheyTalkInfluencerBlock } from "@/components/blocks/TheyTalkInfluencerBlock";
import { FolkeuniversitetDesignSystem } from "@/components/blocks/FolkeuniversitetDesignSystem";
import { AIVisualHeaderZoom } from "@/components/blocks/AIVisualHeaderZoom";
import { AIVisualImageComparison } from "@/components/blocks/AIVisualImageComparison";
import { AIVisualMadeByTeam } from "@/components/blocks/AIVisualMadeByTeam";
import { AIVisualPriceCalculator } from "@/components/blocks/AIVisualPriceCalculator";
import { AIVisualVideoScroll } from "@/components/blocks/AIVisualVideoScroll";
import { AIVisualTextIteration } from "@/components/blocks/AIVisualTextIteration";
import { AIVisualTimeline } from "@/components/blocks/AIVisualTimeline";

interface PageProps {
    params: Promise<{ block: string }>;
}

export default async function BlockPreviewPage({ params }: PageProps) {
    const { block } = await params;

    const rendered = await renderBlock(block);
    if (!rendered) return notFound();

    return (
        <div className="w-full bg-white" style={{ minHeight: "100vh" }}>
            {rendered}
        </div>
    );
}

async function renderBlock(block: string): Promise<React.ReactNode | null> {
    switch (block) {
        // ── Shared blocks ──────────────────────────────────────────
        case "SharedStatsBlock": {
            const data = await readContent("home-stats.json");
            return <SharedStatsBlock stats={data.stats} />;
        }
        case "SharedCenteredQuote": {
            const data = await readContent("home-quote.json");
            return (
                <div className="bg-text">
                    <SharedCenteredQuote quote={data.quote} author={data.author} />
                </div>
            );
        }
        case "SharedClientLogos": {
            const data = await readContent("clients.json");
            return <SharedClientLogos data={data} />;
        }
        case "SharedTestimonials": {
            const data = await readContent("home-testimonials.json");
            return (
                <div className="bg-text">
                    <SharedTestimonials testimonials={data.testimonials} />
                </div>
            );
        }
        case "SharedFAQ": {
            const data = await readContent("home-faq.json");
            return <SharedFAQ data={data} />;
        }
        case "SharedVideoScrollingCTA":
            return <SharedVideoScrollingCTA />;
        case "SharedScrollRevealImage":
            return (
                <div className="max-w-[1475px] mx-auto py-64">
                    <SharedScrollRevealImage
                        src="/img/case-studies/centrogreen/centrogreen-hero.jpg"
                        alt="Preview image"
                    />
                </div>
            );
        case "SharedServicesHero":
            return <SharedServicesHero />;
        case "SharedContactForm":
            return <SharedContactForm />;
        case "SharedContentSplit":
            return (
                <SharedContentSplit
                    heading="Design meets function"
                    text={["We craft digital experiences that balance aesthetics with usability.", "Every decision is grounded in user research and business objectives."]}
                    image={{ src: "/img/case-studies/centrogreen/centrogreen-hero.jpg", alt: "Content split preview" }}
                />
            );

        // ── Home blocks ────────────────────────────────────────────
        case "HomeWhereWeCanHelp": {
            const data = await readContent("home-services.json");
            return <HomeWhereWeCanHelp data={data} />;
        }
        case "HomePartnerStatement": {
            const data = await readContent("home-partner.json");
            return <HomePartnerStatement data={data} />;
        }

        case "HomeAnimatedText":
            return (
                <div className="h-[400px] flex items-center justify-center bg-white">
                    <HomeAnimatedText />
                </div>
            );
        case "HomeHorizontalMasonry":
            return <HomeHorizontalMasonry columns={[]} />;
        case "WorksInfiniteScrollPane":
            return <WorksInfiniteScrollPane items={[]} />;

        // ── About blocks ───────────────────────────────────────────
        case "AboutPlaneHero": {
            const data = await readContent("about.json");
            return <AboutPlaneHero data={data} />;
        }
        case "AboutServicesList": {
            const data = await readContent("aivisuals.json");
            return <AboutServicesList data={data} />;
        }
        case "AboutLocationsMap": {
            const data = await readContent("locations.json");
            return <AboutLocationsMap data={data} />;
        }
        case "AboutTeamAccordion": {
            const data = await readContent("team.json");
            return <AboutTeamAccordion data={data} />;
        }
        case "AboutTeamGallery":
            return <AboutTeamGallery />;

        // ── Case Study blocks ──────────────────────────────────────
        case "CaseStudyTextReveal":
            return (
                <div className="max-w-[1475px] mx-auto py-64">
                    <CaseStudyTextReveal text="We believe in the power of design to transform business. Every pixel, every interaction, every detail matters." />
                </div>
            );
        case "CaseStudyHeroVideo": {
            const data = await readContent("case-studies/centrogreen-general.json");
            return <CaseStudyHeroVideo {...data.hero} />;
        }
        case "CaseStudyDetails": {
            const data = await readContent("case-studies/centrogreen-case-details.json");
            return (
                <div className="max-w-[1475px] mx-auto px-16 md:px-0">
                    <CaseStudyDetails {...data} />
                </div>
            );
        }
        case "CaseStudyImageGridHover":
            return (
                <div className="max-w-[1475px] mx-auto py-64">
                    <CaseStudyImageGridHover
                        heroSrc="/img/case-studies/centrogreen/centrogreen-hero.jpg"
                        gridSrcs={[
                            "/img/case-studies/centrogreen/centrogreen-hero.jpg",
                            "/img/case-studies/centrogreen/centrogreen-hero.jpg",
                            "/img/case-studies/centrogreen/centrogreen-hero.jpg",
                            "/img/case-studies/centrogreen/centrogreen-hero.jpg",
                        ]}
                    />
                </div>
            );
        case "CaseStudyLogoAnimation":
            return (
                <div className="max-w-[1475px] mx-auto py-64">
                    <CaseStudyLogoAnimation />
                </div>
            );
        case "CaseStudyLottieBlock":
            return (
                <div className="max-w-[1475px] mx-auto py-64">
                    <CaseStudyLottieBlock animationPath="/img/lottie/placeholder.json" />
                </div>
            );
        case "CaseStudyNextCaseBlock":
            return (
                <CaseStudyNextCaseBlock
                    title="Centrogreen"
                    subtitle="Brand Identity"
                    link="/case-studies/centrogreen"
                    videoPath=""
                />
            );
        case "CaseStudyTextInsert":
            return (
                <CaseStudyTextInsert title="The Challenge">
                    Every brand has a story worth telling. We craft visual identities that resonate with your audience and stand the test of time.
                </CaseStudyTextInsert>
            );

        // ── Works blocks ───────────────────────────────────────────
        case "WorksSteps":
            return (
                <WorksSteps steps={[
                    "Tell us about your project scope and goals",
                    "We analyse requirements and propose a tailored plan",
                    "We design, build, and iterate together",
                ]} />
            );

        // ── Project-specific blocks ────────────────────────────────
        case "CentrogreenDesignCode":
            return (
                <div className="max-w-[1475px] mx-auto">
                    <CentrogreenDesignCode />
                </div>
            );
        case "TheyTalkDesignSystem":
            return (
                <div className="max-w-[1475px] mx-auto">
                    <TheyTalkDesignSystem />
                </div>
            );
        case "TheyTalkInfluencerBlock": {
            const data = await readContent("case-studies/theytalk-general.json");
            const influencerBlock = data.blocks?.find((b: any) => b.type === "theytalk-influencer");
            return (
                <div className="max-w-[1475px] mx-auto">
                    <TheyTalkInfluencerBlock {...(influencerBlock?.props || {})} />
                </div>
            );
        }
        case "FolkeuniversitetDesignSystem":
            return (
                <div className="max-w-[1475px] mx-auto">
                    <FolkeuniversitetDesignSystem />
                </div>
            );

        // ── AI Visual Content blocks ──────────────────────────────
        case "AIVisualHeaderZoom": {
            const data = await readContent("aivisuals.json");
            return <AIVisualHeaderZoom data={data.hero} />;
        }
        case "AIVisualImageComparison":
            return (
                <AIVisualImageComparison
                    beforeImage="/img/services/ai-case-study/ai-product-shots01.jpg"
                    afterImage="/img/services/ai-case-study/ai-product-shots02.jpg"
                />
            );
        case "AIVisualMadeByTeam": {
            let data;
            try {
                data = await readContent("aivisuals-made-by-team.json");
            } catch {
                data = undefined;
            }
            return <AIVisualMadeByTeam data={data} />;
        }
        case "AIVisualPriceCalculator": {
            let data;
            try {
                data = await readContent("aivisuals-price-calculator.json");
            } catch {
                data = undefined;
            }
            return <AIVisualPriceCalculator data={data} />;
        }
        case "AIVisualVideoScroll": {
            let data;
            try {
                data = await readContent("aivisuals-video-scroll.json", 1);
            } catch {
                data = null;
            }
            return data ? <AIVisualVideoScroll data={data} /> : <div className="p-24 text-center text-gray-400">No video scroll data</div>;
        }
        case "AIVisualTextIteration":
            return (
                <AIVisualTextIteration texts={[
                    "Scaling content is <span class='text-brand'>slow</span> and expensive",
                    "Traditional product <span class='text-brand'>photography</span> can't keep up",
                    "AI-powered visuals <span class='text-brand'>change</span> the game",
                ]} />
            );
        case "AIVisualTimeline": {
            let data;
            try {
                data = await readContent("aivisuals-timeline.json");
            } catch {
                data = null;
            }
            return data ? <AIVisualTimeline data={data} /> : <div className="p-24 text-center text-gray-400">No timeline data</div>;
        }

        default:
            return null;
    }
}

export function generateStaticParams() {
    return [
        // Shared
        { block: "SharedStatsBlock" },
        { block: "SharedCenteredQuote" },
        { block: "SharedClientLogos" },
        { block: "SharedTestimonials" },
        { block: "SharedFAQ" },
        { block: "SharedVideoScrollingCTA" },
        { block: "SharedScrollRevealImage" },
        { block: "SharedServicesHero" },
        { block: "SharedContactForm" },
        { block: "SharedContentSplit" },
        // Home
        { block: "HomeWhereWeCanHelp" },
        { block: "HomePartnerStatement" },
        { block: "HomeAnimatedText" },
        { block: "HomeHorizontalMasonry" },
        { block: "WorksInfiniteScrollPane" },
        // About
        { block: "AboutPlaneHero" },
        { block: "AboutServicesList" },
        { block: "AboutLocationsMap" },
        { block: "AboutTeamAccordion" },
        { block: "AboutTeamGallery" },
        // Case Study
        { block: "CaseStudyTextReveal" },
        { block: "CaseStudyHeroVideo" },
        { block: "CaseStudyDetails" },
        { block: "CaseStudyImageGridHover" },
        { block: "CaseStudyLogoAnimation" },
        { block: "CaseStudyLottieBlock" },
        { block: "CaseStudyNextCaseBlock" },
        { block: "CaseStudyTextInsert" },
        // Works
        { block: "WorksSteps" },
        // Project-specific
        { block: "CentrogreenDesignCode" },
        { block: "TheyTalkDesignSystem" },
        { block: "TheyTalkInfluencerBlock" },
        { block: "FolkeuniversitetDesignSystem" },
        // AI Visual Content
        { block: "AIVisualHeaderZoom" },
        { block: "AIVisualImageComparison" },
        { block: "AIVisualMadeByTeam" },
        { block: "AIVisualPriceCalculator" },
        { block: "AIVisualVideoScroll" },
        { block: "AIVisualTextIteration" },
        { block: "AIVisualTimeline" },
    ];
}
