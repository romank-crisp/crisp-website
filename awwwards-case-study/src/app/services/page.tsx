import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { readContent } from '@/app/actions/content';

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-services.json") as SeoData;
    return parseSeoData(seoData);
}

export * from './services-page';
export { default } from './services-page';
