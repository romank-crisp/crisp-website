import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { caseStudyContentEngine } from "@/content/case-studies/content-engine";

export default function ContentEnginePage() {
    return <CaseStudyPage content={caseStudyContentEngine} />;
}
