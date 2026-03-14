export interface Service {
    id: string;
    label: string;
    image: string;
    animationUrl?: string;
    tags: string[];
    description: string;
}



export interface ServicesData {
    title: string[];
    items: Service[];
    scrollRevealImage?: { src: string; alt?: string };
    textIterations?: string[];
    imageComparison?: {
        beforeImage: string;
        afterImage: string;
    };
    hero?: {
        label?: string;
        title?: string;
        description?: string;
        image?: string;
    };
    contactForm?: {
        title?: string;
        successTitle?: string;
        successMessage?: string;
        successButtonText?: string;
    };
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
    images: TimelineImage[];
}

export interface TimelineData {
    sectionTitle: string;
    steps: TimelineStep[];
}

// Re-export price calculator data type
export type { PriceCalculatorData } from "@/components/blocks/AIVisualPriceCalculator";
