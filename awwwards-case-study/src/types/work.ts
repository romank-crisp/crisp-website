
export interface WorkItem {
    title: string;
    tags: string[];
    image: string;
    video: string;
    poster: string;
    href: string;
}

export interface WorksPageContent {
    heading: {
        phrases: string[];
        staticText: string; // "delivered."
    };
    subheading: {
        title: string; // "Our Works"
        items: string[]; // ["Visual Design", "Websites", ...]
    };
}

export type WorksData = WorkItem[];
