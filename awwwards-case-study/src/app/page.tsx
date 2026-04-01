

import Home from "./home-page";
import { readContentStatic } from "@/lib/content-static";
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { FAQSchema } from "@/components/seo/FAQSchema";

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-home.json") as SeoData;
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
    ] = [
        readContentStatic("home-hero.json"),
        readContentStatic("home-services.json"),
        readContentStatic("home-partner.json"),
        readContentStatic("home-clients.json"),
        readContentStatic("home-stats.json"),
        readContentStatic("home-testimonials.json"),
        readContentStatic("home-quote.json"),
        readContentStatic("home-faq.json")
    ];

    return (
        <>
            <FAQSchema faqData={faqData} />
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
        </>
    );
}
