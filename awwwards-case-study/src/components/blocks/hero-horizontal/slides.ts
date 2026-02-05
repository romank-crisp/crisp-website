export type SlideType = 'image' | 'video' | 'text';

export interface SlideData {
    id: number;
    type: SlideType;
    content: string; // URL for image/video, or text content
    col: number; // Grid column start (1-6)
    row: number; // Grid row start (1-4)
    colSpan?: number; // Default 1
    rowSpan?: number; // Default 1
    title?: string; // For text slides
    subtitle?: string; // For text slides
}

export const HERO_SLIDES: SlideData[] = [
    // Text 1: "Founded in 2007..."
    {
        id: 1,
        type: 'text',
        content: "Founded in 2007 at the intersection of strategy, design, and tech.",
        col: 1,
        row: 2,
        colSpan: 2,
        rowSpan: 1
    },
    // Img 1: Folke...
    {
        id: 2,
        type: 'image',
        content: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
        col: 2,
        row: 1,
        colSpan: 1,
        rowSpan: 2
    },
    // Text 2: "We build brands..."
    {
        id: 3,
        type: 'text',
        content: "We build brands that scale and websites that convert. Craft over concepts.",
        col: 3,
        row: 3,
        colSpan: 2,
        rowSpan: 1
    },
    // Video: CentroGreen
    {
        id: 4,
        type: 'video',
        content: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        col: 4,
        row: 2,
        colSpan: 1,
        rowSpan: 2
    },
    // Text 3: "100+ projects..."
    {
        id: 5,
        type: 'text',
        content: "100+ projects delivered—from startups to enterprise. We learn fast, align hard, and launch clean.",
        col: 5,
        row: 1,
        colSpan: 2,
        rowSpan: 1
    },
    // Img 2: TheyTalk
    {
        id: 6,
        type: 'image',
        content: "/img/imgcases/theytalk/theytalk-01.png",
        col: 5,
        row: 4,
        colSpan: 1,
        rowSpan: 1
    },
    // Text 4: "2026: AI..."
    {
        id: 7,
        type: 'text',
        content: "2026: AI in the workflow, not in the driver’s seat. Faster iterations and better results.",
        col: 6,
        row: 3,
        colSpan: 1,
        rowSpan: 1
    },
    // Img 3: Content Engine
    {
        id: 8,
        type: 'image',
        content: "/img/imgcases/content-engine/ce-01.png",
        col: 2,
        row: 4,
        colSpan: 1,
        rowSpan: 1
    }
];

// Helper to get total track width - fixed at 2000px as per requirements
export const TRACK_WIDTH = 2000;
