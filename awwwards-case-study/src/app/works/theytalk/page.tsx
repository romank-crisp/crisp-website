

import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { readContentStatic } from "@/lib/content-static";
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-theytalk.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const [general, details, stats] = [
        readContentStatic("case-studies/theytalk-general.json"),
        readContentStatic("case-studies/theytalk-case-details.json"),
        readContentStatic("case-studies/theytalk-case-stats.json"),
    ];

    const content = {
        ...general,
        details,
        stats,
    };

    return <CaseStudyPage content={content} />;
}
