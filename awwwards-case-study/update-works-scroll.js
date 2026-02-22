import fs from 'fs';
import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage();
const BUCKET_NAME = "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";
const FILENAME = "works-content.json";

async function run() {
    try {
        console.log(`Downloading current ${FILENAME}...`);
        const filePath = path.join(DATA_PREFIX, FILENAME);

        let currentData = {};
        try {
            const [files] = await storage.bucket(BUCKET_NAME).file(filePath).download();
            currentData = JSON.parse(files.toString());
        } catch (e) {
            console.warn("Could not download existing file, starting fresh.");
        }

        const newData = {
            ...currentData,
            infiniteScroll: [
                { type: "image", src: "/img/workspane/pane-01.mp4" },
                {
                    type: "text",
                    text: "One dedicated team for copy, design, and marketing. Consistent monthly output with zero management overhead."
                },
                { type: "image", src: "/img/workspane/pane-02.jpg" },
                { type: "image", src: "/img/workspane/pane-04.webm" },
                { type: "image", src: "/img/workspane/pane03.mp4" },
                { type: "image", src: "/img/workspane/pane-01.mp4" },
                { type: "image", src: "/img/workspane/pane-02.jpg" },
                { type: "image", src: "/img/workspane/pane-04.webm" },
                { type: "image", src: "/img/workspane/pane03.mp4" },
                { type: "image", src: "/img/workspane/pane-01.mp4" },
                { type: "image", src: "/img/workspane/pane-02.jpg" },
                {
                    type: "text",
                    text: "Fixed monthly scope. You define the goals; we handle end-to-end execution for a consistent, multi-channel presence."
                },
                { type: "image", src: "/img/workspane/pane-04.webm" },
                { type: "image", src: "/img/workspane/pane03.mp4" },
                { type: "image", src: "/img/workspane/pane-01.mp4" },
                { type: "image", src: "/img/workspane/pane-02.jpg" },
                {
                    type: "text",
                    text: "Human expertise scaled by AI. Models accelerate research, while our team protects and refines your brand voice."
                },
                { type: "image", src: "/img/workspane/pane03.mp4" }
            ]
        };

        console.log(`Uploading updated ${FILENAME}...`);
        await storage.bucket(BUCKET_NAME).file(filePath).save(JSON.stringify(newData, null, 2));
        console.log("Upload complete!");

    } catch (error) {
        console.error("Fatal error:", error);
    }
}

run();
