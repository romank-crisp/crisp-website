export const revalidate = 3600; // ISR: regenerate every hour

import AIVisualContentPage from './ai-visual-content-page';
import { readContent } from '@/lib/content';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    let seoData;
    try {
        seoData = await readContent("seo/seo-aivisuals.json") as SeoData;
        if (!seoData) throw new Error("No seo data");
        seoData.title = "AI Assisted Visual Content | Crisp Studio";
    } catch {
        seoData = {
            title: "AI Assisted Visual Content | Crisp Studio",
            metaTags: [
                "<meta name=\"description\" content=\"Static and motion — boost products visual intensity and connect your customers to the brands\">"
            ],
            openGraph: [
                "<meta property=\"og:title\" content=\"AI Assisted Visual Content | Crisp Studio\">",
                "<meta property=\"og:description\" content=\"Static and motion — boost products visual intensity and connect your customers to the brands\">"
            ]
        } as unknown as SeoData;
    }
    return parseSeoData(seoData);
}

export default async function Page() {
    const [servicesData, faqData] = await Promise.all([
        readContent("aivisuals.json"),
        readContent("aivisuals-faq.json"),
    ]);

    // Video scroll data is optional
    let videoScrollData;
    try {
        videoScrollData = await readContent("aivisuals-video-scroll.json", 1);
    } catch {
        videoScrollData = null;
    }

    // Timeline data is optional
    let timelineData;
    try {
        timelineData = await readContent("aivisuals-timeline.json", 1);
    } catch {
        timelineData = null;
    }

    // Price calculator data is optional
    let priceCalculatorData;
    try {
        priceCalculatorData = await readContent("aivisuals-price-calculator.json");
    } catch {
        priceCalculatorData = null;
    }

    // Made by team data is optional
    let madeByTeamData;
    try {
        madeByTeamData = await readContent("aivisuals-made-by-team.json");
    } catch {
        madeByTeamData = null;
    }

    // What we offer data is optional
    let whatWeOfferData;
    try {
        whatWeOfferData = await readContent("aivisuals-what-we-offer.json");
    } catch {
        whatWeOfferData = null;
    }

    // CTA data is optional
    let ctaData;
    try {
        ctaData = await readContent("aivisuals-cta.json");
    } catch {
        ctaData = null;
    }

    return (
        <AIVisualContentPage
            servicesData={servicesData}
            faqData={faqData}
            videoScrollData={videoScrollData}
            timelineData={timelineData}
            priceCalculatorData={priceCalculatorData}
            madeByTeamData={madeByTeamData}
            whatWeOfferData={whatWeOfferData}
            ctaData={ctaData}
        />
    );
}
