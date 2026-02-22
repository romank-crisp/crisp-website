
import { Storage } from "@google-cloud/storage";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const storage = new Storage();
const BUCKET_NAME = "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";

const WORKS = [
    {
        title: "Folkeuniversitetet",
        tags: ["Branding", "Communication Materials", "Web Design"],
        image: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
        video: "/img/imgcases/folkeuniversitetet/fu-showreel.webm",
        poster: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
        href: "/works/folkeuniversitetet"
    },
    {
        title: "CentroGreen",
        tags: ["Visual Identity", "Web Design", "Animation"],
        image: "/img/imgcases/centrogreen/cg-image-01.jpg",
        video: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        poster: "/img/imgcases/centrogreen/cg-image-01.jpg",
        href: "/works/centrogreen"
    },
    {
        title: "TheyTalk",
        tags: ["Platform", "Web Design", "Development"],
        image: "/img/imgcases/theytalk/theytalk-01.png",
        video: "/img/imgcases/theytalk/theytalk-full.webm",
        poster: "/img/imgcases/theytalk/theytalk-01.png",
        href: "/works/theytalk"
    }
];

const WORKS_CONTENT = {
    heading: {
        phrases: [
            "brands that scale.",
            "websites that convert.",
            "robust design systems.",
            "omnichannel content.",
            "rock-solid design."
        ],
        staticText: "delivered."
    },
    subheading: {
        title: "Our Works",
        items: [
            "Visual Design",
            "Websites",
            "User Experience",
            "Content Design"
        ]
    },
    bottomText: "No project is too small. From pitch decks to campaign assets, from website refinements to AI landing pages — we handle your everyday design needs. <em class=\"italic font-serif animate-gradient-text-dark px-1\">Packages start at 40h per month.</em>"
};

async function seedWorks() {
    console.log("Seeding works.json...");
    try {
        const filename = "works.json";
        const filePath = path.join(DATA_PREFIX, filename);
        await storage.bucket(BUCKET_NAME).file(filePath).save(JSON.stringify(WORKS, null, 2));
        console.log(`Successfully uploaded ${filename} to ${BUCKET_NAME}/${filePath}`);

        const contentFilename = "works-content.json";
        const contentFilePath = path.join(DATA_PREFIX, contentFilename);
        await storage.bucket(BUCKET_NAME).file(contentFilePath).save(JSON.stringify(WORKS_CONTENT, null, 2));
        console.log(`Successfully uploaded ${contentFilename} to ${BUCKET_NAME}/${contentFilePath}`);
    } catch (error) {
        console.error("Error seeding works:", error);
        process.exit(1);
    }
}

seedWorks();
