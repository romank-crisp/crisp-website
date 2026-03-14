export const dynamic = 'force-dynamic';

import AIVisualContentPage from './ai-visual-content-page';
import { readContent } from '@/lib/content';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    let seoData;
    try {
        seoData = await readContent("seo/seo-services.json") as SeoData;
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
        readContent("services.json"),
        readContent("home-faq.json"),
    ]);

    // Product interactive video data is optional
    let productInteractiveData;
    try {
        productInteractiveData = await readContent("services-product-interactive.json", 1);
    } catch {
        productInteractiveData = null;
    }

    // Timeline data is optional
    let timelineData;
    try {
        timelineData = await readContent("services-timeline.json");
    } catch {
        timelineData = null;
    }

    // Price calculator data is optional
    let priceCalculatorData;
    try {
        priceCalculatorData = await readContent("services-price-calculator.json");
    } catch {
        priceCalculatorData = null;
    }

    // Made by team data is optional
    let madeByTeamData;
    try {
        madeByTeamData = await readContent("services-made-by-team.json");
    } catch {
        madeByTeamData = null;
    }

    return (
        <AIVisualContentPage
            servicesData={servicesData}
            faqData={faqData}
            productInteractiveData={productInteractiveData}
            timelineData={timelineData}
            priceCalculatorData={priceCalculatorData}
            madeByTeamData={madeByTeamData}
        />
    );
}
