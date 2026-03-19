

import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";
import { readContentStatic } from '@/lib/content-static';

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-contact.json") as SeoData;
    return parseSeoData(seoData);
}

export * from './contact-page';
export { default } from './contact-page';
