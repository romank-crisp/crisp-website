export interface AboutHeroData {
    headerWords: string[];
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
