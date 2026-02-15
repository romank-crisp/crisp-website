import { Metadata } from "next";
import { SeoData } from "@/types/seo";

/**
 * Parses raw HTML meta tags from JSON and converts them to Next.js Metadata
 */
export function parseSeoData(seoData: SeoData): Metadata {
    const metadata: Metadata = {};

    // Parse title
    const titleMatch = seoData.title.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
        metadata.title = titleMatch[1];
    }

    // Parse meta tags
    const description = extractMetaContent(seoData.metaTags, 'name', 'description');
    if (description) {
        metadata.description = description;
    }

    const robots = extractMetaContent(seoData.metaTags, 'name', 'robots');
    if (robots) {
        metadata.robots = robots;
    }

    // Parse canonical
    if (seoData.canonical) {
        const canonicalMatch = seoData.canonical.match(/href="(.*?)"/);
        if (canonicalMatch) {
            metadata.alternates = {
                canonical: canonicalMatch[1]
            };
        }
    }

    // Parse Open Graph
    metadata.openGraph = {};

    const ogTitle = extractMetaContent(seoData.openGraph, 'property', 'og:title');
    if (ogTitle) {
        metadata.openGraph.title = ogTitle;
    }

    const ogDescription = extractMetaContent(seoData.openGraph, 'property', 'og:description');
    if (ogDescription) {
        metadata.openGraph.description = ogDescription;
    }

    return metadata;
}

/**
 * Extracts content attribute from a meta tag
 */
function extractMetaContent(tags: string[], attr: string, name: string): string | null {
    const tag = tags.find(t => t.includes(`${attr}="${name}"`));
    if (!tag) return null;

    const match = tag.match(/content="(.*?)"/);
    return match ? match[1] : null;
}
