export interface SeoData {
    title: string;           // Raw <title> tag
    metaTags: string[];      // Array of <meta> tags
    openGraph: string[];     // Array of <meta property="og:..."> tags
    canonical?: string;      // Optional <link rel="canonical">
}
