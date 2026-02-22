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
}

