export interface Service {
    id: string;
    label: string;
    image: string;
    animationUrl?: string;
    tags: string[];
    description: string;
}



export interface ServicesData {
    title?: string[];
    items?: Service[];
    hero?: {
        label?: string;
        title?: string;
        description?: string;
        image?: string;
        bentoImages?: CloudImage[];
    };
}

export interface CloudImage {
    src: string;
    videoSrc?: string;
    gridClass: string;
    isCenter?: boolean;
}

export interface TimelineImage {
    src: string;
    alt: string;
}

export interface TimelineStep {
    id: string;
    day: string;
    title: string;
    description: string;
    list?: string[];
    images: TimelineImage[];
}

export interface TimelineData {
    sectionTitle: string;
    steps: TimelineStep[];
}

// Re-export price calculator data type
export type { PriceCalculatorV2Data as PriceCalculatorData } from "@/components/blocks/AIVisualPriceCalculator";
