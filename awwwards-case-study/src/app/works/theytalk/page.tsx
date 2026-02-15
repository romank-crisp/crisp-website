import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { readContent } from "@/app/actions/content";
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-theytalk.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const [general, details, stats] = await Promise.all([
        readContent("case-studies/theytalk-general.json"),
        readContent("case-studies/theytalk-case-details.json"),
        readContent("case-studies/theytalk-case-stats.json"),
    ]);

    const content = {
        ...general,
        details,
        stats,
    };

    return <CaseStudyPage content={content} />;
}
