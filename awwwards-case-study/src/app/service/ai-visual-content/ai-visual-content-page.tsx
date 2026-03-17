"use client";

import { AIVisualHeaderZoom } from "@/components/blocks/AIVisualHeaderZoom";
import { SharedFAQ } from "@/components/blocks/SharedFAQ";
import { AIVisualImageComparison } from "@/components/blocks/AIVisualImageComparison";
import { AIVisualVideoScroll, VideoScrollData } from "@/components/blocks/AIVisualVideoScroll";
import { AIVisualTimeline } from "@/components/blocks/AIVisualTimeline";
import { AIVisualPriceCalculator, PriceCalculatorV2Data } from "@/components/blocks/AIVisualPriceCalculator";
import { AIVisualMadeByTeam, MadeByTeamData } from "@/components/blocks/AIVisualMadeByTeam";
import { AIVisualWhatWeOffer } from "@/components/blocks/AIVisualWhatWeOffer";
import { ServicesData, TimelineData } from "@/content/services";
import { HomeFAQData } from "@/types/home";
import { WhatWeOfferData } from "@/types/services-what-we-offer";
import { SharedVideoScrollingCTA } from "@/components/blocks/SharedVideoScrollingCTA";
import { ServicesCTAData, DEFAULT_SERVICES_CTA } from "@/types/services-cta";

interface Props {
    servicesData: ServicesData;
    faqData: HomeFAQData;
    videoScrollData?: VideoScrollData;
    timelineData?: TimelineData;
    priceCalculatorData?: PriceCalculatorV2Data;
    madeByTeamData?: MadeByTeamData;
    whatWeOfferData?: WhatWeOfferData;
    ctaData?: ServicesCTAData;
}

export default function AIVisualContentPage({ servicesData, faqData, videoScrollData, timelineData, priceCalculatorData, madeByTeamData, whatWeOfferData, ctaData }: Props) {
    if (!servicesData || !faqData) {
        return (
            <main className="min-h-screen bg-white" />
        );
    }

    return (
        <main className="min-h-screen bg-white">

            <AIVisualHeaderZoom data={servicesData.hero} />

            <AIVisualWhatWeOffer data={whatWeOfferData} />


            {videoScrollData && (
                <AIVisualVideoScroll data={videoScrollData} />
            )}
            {timelineData && (
                <AIVisualTimeline data={timelineData} />
            )}
            <AIVisualMadeByTeam data={madeByTeamData} />


            <AIVisualPriceCalculator data={priceCalculatorData} />




            <SharedFAQ data={faqData} forceLightMode={true} />

            <SharedVideoScrollingCTA data={ctaData || DEFAULT_SERVICES_CTA} />

        </main>
    );
}
