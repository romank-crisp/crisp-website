

import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { readContentStatic } from '@/lib/content-static';

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-privacy-policy.json") as SeoData;
    return parseSeoData(seoData);
}

export * from './privacy-policy-page';
export { default } from './privacy-policy-page';
