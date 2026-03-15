export const dynamic = 'force-dynamic';

import { readContent } from '@/lib/content';
import PreviewClient from './PreviewClient';

export default async function PreviewPage() {
    const [servicesData, faqData] = await Promise.all([
        readContent("aivisuals.json"),
        readContent("aivisuals-faq.json"),
    ]);

    let videoScrollData = await readContent("aivisuals-video-scroll.json", 1).catch(() => null);
    let timelineData = await readContent("aivisuals-timeline.json").catch(() => null);
    let priceCalculatorData = await readContent("aivisuals-price-calculator.json").catch(() => null);
    let madeByTeamData = await readContent("aivisuals-made-by-team.json").catch(() => null);

    return (
        <PreviewClient
            servicesData={servicesData}
            faqData={faqData}
            videoScrollData={videoScrollData}
            timelineData={timelineData}
            priceCalculatorData={priceCalculatorData}
            madeByTeamData={madeByTeamData}
        />
    )
}
