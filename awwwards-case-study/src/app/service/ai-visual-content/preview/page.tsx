export const dynamic = 'force-dynamic';

import { readContent } from '@/lib/content';
import PreviewClient from './PreviewClient';

export default async function PreviewPage() {
    const [servicesData, faqData] = await Promise.all([
        readContent("services.json"),
        readContent("home-faq.json"),
    ]);

    let productInteractiveData = await readContent("services-product-interactive.json", 1).catch(() => null);
    let timelineData = await readContent("services-timeline.json").catch(() => null);
    let priceCalculatorData = await readContent("services-price-calculator.json").catch(() => null);
    let madeByTeamData = await readContent("services-made-by-team.json").catch(() => null);

    return (
        <PreviewClient
            servicesData={servicesData}
            faqData={faqData}
            productInteractiveData={productInteractiveData}
            timelineData={timelineData}
            priceCalculatorData={priceCalculatorData}
            madeByTeamData={madeByTeamData}
        />
    )
}
