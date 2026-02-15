import { WorksPage } from './works-page';
import { readContent } from '@/lib/content';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-works.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const clientsData = await readContent("clients.json");
    return <WorksPage clientsData={clientsData} />;
}
