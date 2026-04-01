
import AIVisualContentPage from './ai-visual-content-page';
import { readContentStatic } from '@/lib/content-static';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    let seoData;
    try {
        seoData = readContentStatic("seo/seo-aivisuals.json") as SeoData;
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
    const servicesData = readContentStatic("aivisuals.json");
    const faqData = readContentStatic("aivisuals-faq.json");

    // Optional content files — gracefully handle missing
    let videoScrollData = null;
    try { videoScrollData = readContentStatic("aivisuals-video-scroll.json"); } catch { /* optional */ }

    let timelineData = null;
    try { timelineData = readContentStatic("aivisuals-timeline.json"); } catch { /* optional */ }

    let priceCalculatorData = null;
    try { priceCalculatorData = readContentStatic("aivisuals-price-calculator.json"); } catch { /* optional */ }

    let madeByTeamData = null;
    try { madeByTeamData = readContentStatic("aivisuals-made-by-team.json"); } catch { /* optional */ }

    let whatWeOfferData = null;
    try { whatWeOfferData = readContentStatic("aivisuals-what-we-offer.json"); } catch { /* optional */ }

    let ctaData = null;
    try { ctaData = readContentStatic("aivisuals-cta.json"); } catch { /* optional */ }

    let textIterationData = null;
    try { textIterationData = readContentStatic("aivisuals-text-iteration.json"); } catch { /* optional */ }

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
            textIterationData={textIterationData}
        />
    );
}
