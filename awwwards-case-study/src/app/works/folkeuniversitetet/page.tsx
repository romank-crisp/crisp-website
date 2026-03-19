

import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { readContentStatic } from "@/lib/content-static";
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-folkeuniversitetet.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const [general, details, stats] = [
        readContentStatic("case-studies/folkeuniversitetet-general.json"),
        readContentStatic("case-studies/folkeuniversitetet-case-details.json"),
        readContentStatic("case-studies/folkeuniversitetet-case-stats.json"),
    ];

    const content = {
        ...general,
        details,
        stats,
    };

    return <CaseStudyPage content={content} />;
}
