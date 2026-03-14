"use client";

import { AIVisualHeaderZoom } from "@/components/blocks/AIVisualHeaderZoom";
import { SharedFAQ } from "@/components/blocks/SharedFAQ";
import { AIVisualImageComparison } from "@/components/blocks/AIVisualImageComparison";
import { AIVisualProductInteractive, ProductInteractiveData } from "@/components/blocks/AIVisualProductInteractive";
import { AIVisualTimeline } from "@/components/blocks/AIVisualTimeline";
import { AIVisualPriceCalculator, PriceCalculatorData } from "@/components/blocks/AIVisualPriceCalculator";
import { AIVisualMadeByTeam, MadeByTeamData } from "@/components/blocks/AIVisualMadeByTeam";
import { AIVisualWhatWeOffer } from "@/components/blocks/AIVisualWhatWeOffer";
import { ServicesData, TimelineData } from "@/content/services";
import { HomeFAQData } from "@/types/home";
import { WhatWeOfferData } from "@/types/services-what-we-offer";



interface Props {
    servicesData: ServicesData;
    faqData: HomeFAQData;
    productInteractiveData?: ProductInteractiveData;
    timelineData?: TimelineData;
    priceCalculatorData?: PriceCalculatorData;
    madeByTeamData?: MadeByTeamData;
    whatWeOfferData?: WhatWeOfferData;
}

export default function AIVisualContentPage({ servicesData, faqData, productInteractiveData, timelineData, priceCalculatorData, madeByTeamData, whatWeOfferData }: Props) {
    if (!servicesData || !faqData) {
        return (
            <main className="min-h-screen bg-white" />
        );
    }

    return (
        <main className="min-h-screen bg-white">

            <AIVisualHeaderZoom data={servicesData.hero} />

            <AIVisualWhatWeOffer data={whatWeOfferData} />


            {productInteractiveData && (
                <AIVisualProductInteractive data={productInteractiveData} />
            )}

            {timelineData && (
                <AIVisualTimeline data={timelineData} />
            )}

            <AIVisualPriceCalculator data={priceCalculatorData} />

            <AIVisualMadeByTeam data={madeByTeamData} />


            <SharedFAQ data={faqData} forceLightMode={true} />

        </main>
    );
}
