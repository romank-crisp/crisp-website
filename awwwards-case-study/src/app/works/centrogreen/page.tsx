import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { readContent } from "@/app/actions/content";

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
