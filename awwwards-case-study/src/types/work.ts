
export interface WorkItem {
    title: string;
    tags: string[];
    image: string;
    video: string;
    poster: string;
    href: string;
}

export interface InfiniteScrollItem {
    id: string;
    type: "image" | "text";
    width: number;
    height: number;
    color: string;
    label: string;
    text?: string;
    src?: string;
}

export interface InfiniteScrollContentItem {
    type: "image" | "text";
    src?: string;
    text?: string;
    color?: string; // Hex color for lottie/text background
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
    bottomText?: string;
    spinnerUrl?: string;
    infiniteScroll?: InfiniteScrollContentItem[];
    steps?: string[];
}

export type WorksData = WorkItem[];
