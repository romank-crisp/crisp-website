
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

async function seedWorks() {
    console.log("Seeding works.json...");
    try {
        const filename = "works.json";
        const filePath = path.join(DATA_PREFIX, filename);
        await storage.bucket(BUCKET_NAME).file(filePath).save(JSON.stringify(WORKS, null, 2));
        console.log(`Successfully uploaded ${filename} to ${BUCKET_NAME}/${filePath}`);
    } catch (error) {
        console.error("Error seeding works:", error);
        process.exit(1);
    }
}

seedWorks();
