import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
            {
                userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'Claude-Web', 'Anthropic-ai', 'PerplexityBot', 'Bingbot'],
                allow: '/',
            }
        ],
        sitemap: 'https://crisp-studio.com/sitemap.xml',
    }
}
