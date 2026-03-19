

import { WorksPage } from './works-page';
import { getAssetUrl } from "@/lib/utils";
import { readContentStatic } from '@/lib/content-static';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { WorksData, WorksPageContent } from "@/types/work";



export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-works.json") as SeoData | null;

    if (!seoData) {
        return {
            title: "Our Works - Crisp Studio",
            description: "Explore our portfolio of award-winning digital projects.",
            openGraph: {
                images: [getAssetUrl("/img/og-works.jpg")]
            }
        };
    }

    return parseSeoData(seoData);
}

export default async function Page() {
    const clientsData = readContentStatic("clients.json");
    const worksContent = readContentStatic("works-content.json") as WorksPageContent;

    let worksData: WorksData;
    const raw = readContentStatic("works.json");
    // GCS may store works as an object with numeric keys {"0": {...}, "1": {...}} instead of an array
    if (Array.isArray(raw)) {
        worksData = raw;
    } else if (raw && typeof raw === "object") {
        worksData = Object.values(raw);
    } else {
        worksData = [];
    }

    return <WorksPage clientsData={clientsData} worksData={worksData} content={worksContent} />;
}
