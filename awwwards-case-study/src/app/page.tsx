export const dynamic = 'force-dynamic';

import Home from "./home-page";
import { readContent } from "@/lib/content";
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-home.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const [
        heroData,
        servicesData,
        partnerData,
        clientsData,
        statsData,
        testimonialsData,
        quoteData,
        faqData
    ] = await Promise.all([
        readContent("home-hero.json"),
        readContent("home-services.json"),
        readContent("home-partner.json"),
        readContent("home-clients.json"),
        readContent("home-stats.json"),
        readContent("home-testimonials.json"),
        readContent("home-quote.json"),
        readContent("home-faq.json")
    ]);

    return (
        <Home
            heroData={heroData}
            servicesData={servicesData}
            partnerData={partnerData}
            clientsData={clientsData}
            statsData={statsData}
            testimonialsData={testimonialsData}
            quoteData={quoteData}
            faqData={faqData}
        />
    );
}
