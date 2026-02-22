export interface AboutHeroData {
    headerWords: string[];
    videoDesktop?: string;
    videoMobile?: string;
    headerSuffix: {
        since: string;
        year: string;
    };
    blocks: {
        id: string;
        title: string;
        content: string;
        column: "left" | "right";
    }[];
}
