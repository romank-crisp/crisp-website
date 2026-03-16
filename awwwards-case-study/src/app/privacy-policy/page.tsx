export const revalidate = 3600; // ISR: regenerate every hour

import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { readContent } from '@/lib/content';

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-privacy-policy.json") as SeoData;
    return parseSeoData(seoData);
}

export * from './privacy-policy-page';
export { default } from './privacy-policy-page';
