export const revalidate = 3600; // ISR: regenerate every hour

import { WorksPage } from './works-page';
import { getAssetUrl } from "@/lib/utils";
import { readContent } from '@/lib/content';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { WorksData, WorksPageContent } from "@/types/work";



export async function generateMetadata() {
    const seoData = await readContent("seo/seo-works.json").catch(() => null) as SeoData | null;

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
    const clientsData = await readContent("clients.json").catch(() => []);
    const worksContent = await readContent("works-content.json").catch(() => ({} as WorksPageContent));

    let worksData: WorksData;
    try {
        worksData = await readContent("works.json");
        // Ensure default fallback if file is empty or invalid
        if (!worksData || !Array.isArray(worksData)) {
            worksData = [];
        }
    } catch (error) {
        console.warn("Failed to load works.json, using default data.", error);
        worksData = [];
    }

    return <WorksPage clientsData={clientsData} worksData={worksData} content={worksContent} />;
}
