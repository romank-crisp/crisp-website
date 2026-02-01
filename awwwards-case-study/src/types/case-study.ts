import { ReactNode } from "react";

// --- Base Block Types ---

export interface BaseBlockProps {
    className?: string; // For light customization if really needed, but try to avoid
}

// --- Specific Block Props (Strict) ---

export interface TextRevealProps extends BaseBlockProps {
    text: string;
    className?: string; // Keeping as per existing component, but maybe restrict?
}

export interface ScrollRevealImageProps extends BaseBlockProps {
    src: string;
    videoSrc?: string;
    alt: string;
    aspectRatio?: string; // e.g. "aspect-video", "aspect-square"
}

export interface ImageGridHoverProps extends BaseBlockProps {
    heroSrc: string;
    gridSrcs: string[];
    alt: string;
}

export interface HeroVideoProps /* extends BaseBlockProps */ {
    title: string;
    subtitle: string;
    videoPath: string;
    posterPath: string;
    tags: string[];
    onPlayChange?: (isPlaying: boolean) => void;
}

export interface CaseStudyDetailsSection {
    title: string;
    content: ReactNode; // We allow JSX here for rich text flexibility without a full CMS/MDX parser yet
}

export interface CaseStudySidebarItem {
    label: string;
    value: string | ReactNode;
    isRed?: boolean;
}

export interface CaseStudyDetailsProps extends BaseBlockProps {
    intro: string;
    sections: CaseStudyDetailsSection[];
    sidebar: CaseStudySidebarItem[];
}

export interface StatItem {
    value: string;
    label: string;
}

export interface StatsBlockProps extends BaseBlockProps {
    stats: StatItem[];
}

// --- Discriminated Union for Dynamic Blocks ---

export type CaseStudyBlock =
    | { type: 'text-reveal'; id: string; props: TextRevealProps }
    | { type: 'image-scroll'; id: string; props: ScrollRevealImageProps }
    | { type: 'image-grid-hover'; id: string; props: ImageGridHoverProps }
    | { type: 'grid-2-col'; id: string; props: { left: ScrollRevealImageProps; right: ScrollRevealImageProps } }
    | { type: 'grid-3-col'; id: string; props: { items: ScrollRevealImageProps[] } }
    | { type: 'feature-grid'; id: string; props: FeatureGridProps }
    | { type: 'process-steps'; id: string; props: ProcessStepsProps }
    | { type: 'pricing-table'; id: string; props: PricingTableProps }
    | { type: 'content-split'; id: string; props: ContentSplitProps }
    | { type: 'logo-animation'; id: string; props: BaseBlockProps }
    | { type: 'theytalk-influencer'; id: string; props: TheyTalkInfluencerBlockProps }
    | { type: 'theytalk-design-system'; id: string; props: BaseBlockProps }
    | { type: 'centrogreen-designcode'; id: string; props: BaseBlockProps }
    | { type: 'lottie'; id: string; props: LottieBlockProps };

// --- New Block Props ---

export interface LottieBlockProps extends BaseBlockProps {
    animationPath: string;
    loop?: boolean;
    autoplay?: boolean;
    aspectRatio?: string;
}

export interface TheyTalkInfluencerBlockProps extends BaseBlockProps {
    videoSrc: string;
    overlayImageSrc: string;
    logoSrc: string;
    aspectRatio?: string;
}

export interface ColorPaletteItem {
    id: string;
    name: string;
    color: string;
    textColor: string;
    rgb: string;
    cmyk: string;
}

export interface FeatureItem {
    title: string;
    description: string;
    icon?: ReactNode; // Optional icon/number
}

export interface FeatureGridProps extends BaseBlockProps {
    title?: string;
    subtitle?: string;
    features: FeatureItem[];
}

export interface ProcessStep {
    stepLabel: string; // e.g. "01 / SHARE"
    title: string;
    description: string;
}

export interface ProcessStepsProps extends BaseBlockProps {
    title?: string;
    description?: string;
    steps: ProcessStep[];
}

export interface PricingFeature {
    label: string;
    isIncluded: boolean;
}

export interface PricingTier {
    name: string;
    price: string;
    priceSuffix?: string;
    features: string[]; // Simple string array for list items
    ctaLabel: string;
    isPopular?: boolean;
    style?: 'default' | 'highlight' | 'outline';
}

export interface PricingTableProps extends BaseBlockProps {
    title?: string;
    tiers: PricingTier[];
}

export interface ContentSplitProps extends BaseBlockProps {
    heading: string;
    text: ReactNode; // Or string[] for paragraphs
    image: ScrollRevealImageProps;
    reverse?: boolean; // Image on left
}


// --- Page Content Model ---

export interface NextCaseProps {
    title: string;
    subtitle: string;
    link: string; // URL
    videoPath?: string; // Optional video background
}

export interface CaseStudyContent {
    slug: string;
    meta: {
        title: string;
        description: string;
    };
    hero: HeroVideoProps;
    details: CaseStudyDetailsProps;
    blocks: CaseStudyBlock[];
    stats: StatsBlockProps;
    nextCase?: NextCaseProps;
}
