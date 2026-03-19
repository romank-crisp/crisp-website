export const dynamic = 'force-dynamic';

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
        const raw = await readContent("works.json");
        // GCS may store works as an object with numeric keys {"0": {...}, "1": {...}} instead of an array
        if (Array.isArray(raw)) {
            worksData = raw;
        } else if (raw && typeof raw === "object") {
            worksData = Object.values(raw);
        } else {
            worksData = [];
        }
    } catch (error) {
        console.warn("Failed to load works.json, using default data.", error);
        worksData = [];
    }

    return <WorksPage clientsData={clientsData} worksData={worksData} content={worksContent} />;
}
