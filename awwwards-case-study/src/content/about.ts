
import aboutData from "./data/about.json";

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

export const aboutHeroData: AboutHeroData = aboutData as unknown as AboutHeroData;
