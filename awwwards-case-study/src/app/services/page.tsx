export const dynamic = 'force-dynamic';

import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { readContent } from '@/lib/content';

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-services.json") as SeoData;
    return parseSeoData(seoData);
}

export * from './services-page';
export { default } from './services-page';
