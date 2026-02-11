import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { readContent } from "@/app/actions/content";

export default async function Page() {
    const [general, details, stats] = await Promise.all([
        readContent("case-studies/folkeuniversitetet-general.json"),
        readContent("case-studies/folkeuniversitetet-case-details.json"),
        readContent("case-studies/folkeuniversitetet-case-stats.json"),
    ]);

    const content = {
        ...general,
        details,
        stats,
    };

    return <CaseStudyPage content={content} />;
}
