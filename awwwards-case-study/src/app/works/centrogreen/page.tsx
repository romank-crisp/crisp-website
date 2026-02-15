import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { readContent } from "@/lib/content";
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-centrogreen.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const [general, details, stats] = await Promise.all([
        readContent("case-studies/centrogreen-general.json"),
        readContent("case-studies/centrogreen-case-details.json"),
        readContent("case-studies/centrogreen-case-stats.json"),
    ]);

    const content = {
        ...general,
        details,
        stats,
    };

    return <CaseStudyPage content={content} />;
}
