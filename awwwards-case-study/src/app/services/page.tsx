

import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { readContentStatic } from '@/lib/content-static';

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-aivisuals.json") as SeoData;
    return parseSeoData(seoData);
}

export * from './services-page';
export { default } from './services-page';
