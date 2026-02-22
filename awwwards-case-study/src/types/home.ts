export interface HeroText {
    words: string[];
    tagline: string;
}

export interface MasonryCell {
    id: string;
    height: string;
    className: string;
    // We will store the "type" of content here, and render accordingly in the component
    contentType: 'hero-text' | 'video' | 'distortion-image' | 'lottie' | 'image' | 'empty' | 'spline';
    contentProps?: {
        src?: string;
        alt?: string;
        lottieSrc?: string;
        videoSrc?: string;
        splineUrl?: string;
    };
}

export interface MasonryColumn {
    id: string;
    width: string;
    cells: MasonryCell[];
}

export interface HomeHeroData {
    heroText: HeroText;
    columns: MasonryColumn[];
}

export interface Service {
    title: string;
    description: string;
    labels: string[];
}

export interface WhereWeCanHelpData {
    title: string[];
    services: Service[];
}

export interface PartnerStatementData {
    heading: {
        line1: string;
        line2: string;
    };
    description: string;
}

export interface ClientLogo {
    name: string;
    src: string;
    url: string | null;
}

export interface HomeClientsData {
    clients: ClientLogo[];
}

export interface StatItem {
    value: string;
    label: string;
}

export interface HomeStatsData {
    stats: StatItem[];
}

export interface Testimonial {
    quote: string;
    logo: string;
    name: string;
    position: string;
}

export interface HomeQuoteData {
    quote: string;
    author: string;
}

export interface HomeTestimonialsData {
    testimonials: Testimonial[];
}

export interface ScrollRevealImageData {
    src: string;
    alt: string;
    aspectRatio?: string;
    mode?: "intrinsic" | "cover";
    videoSrc?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface HomeFAQData {
    title: string;
    items: FAQItem[];
}
