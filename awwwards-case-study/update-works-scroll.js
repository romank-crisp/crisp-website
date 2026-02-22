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
                // ROW 1 -> height roughly 500
                { id: "text-1-1", row: 1, slot: 1, type: "text", text: "Your go-to design team for everything — from daily production tasks to complex digital builds. Fast execution, high standards, zero management chaos.", width: 800, height: 500 },
                { id: "asset-1-2", row: 1, slot: 2, type: "image", src: "/img/workspane/pane-01-cardblock.mp4", label: "Website detalization", width: 1000, height: 500 },
                { id: "asset-1-3", row: 1, slot: 3, type: "image", src: "/img/workspane/pane-02-melanoma.jpg", label: "Key Visuals", width: 900, height: 500 },
                { id: "asset-1-4", row: 1, slot: 4, type: "image", src: "/img/workspane/pane-03-lingu.mp4", label: "AI-assisted visual storytelling", width: 700, height: 500 },
                { id: "asset-1-5", row: 1, slot: 5, type: "image", src: "/img/workspane/pane-10-package.jpg", label: "Packaging Concept", width: 800, height: 500 },

                // ROW 2 -> height roughly 700
                { id: "asset-2-1", row: 2, slot: 1, type: "image", src: "/img/workspane/pane-04-lung.webm", label: "Illustration and Visuals", width: 1000, height: 700 },
                { id: "asset-2-2", row: 2, slot: 2, type: "image", src: "/img/workspane/pane-05-aiflower.webm", label: "AI-assisted Visuals", width: 800, height: 700 },
                { id: "text-2-3", row: 2, slot: 3, type: "text", text: "One dedicated team for copy, design, and marketing. Consistent monthly output with zero management overhead.", width: 700, height: 700 },
                { id: "asset-2-4", row: 2, slot: 4, type: "image", src: "/img/workspane/pane-06-donut.webm", label: "3D and Interactive", width: 1100, height: 700 },
                { id: "asset-2-5", row: 2, slot: 5, type: "image", src: "/img/workspane/pane-07-discconnector.json", color: "#3B1C95", label: "Web Animation and Engaging Content", width: 600, height: 700 },

                // ROW 3 -> height roughly 560
                { id: "asset-3-1", row: 3, slot: 1, type: "image", src: "/img/workspane/pane-08-route.json", color: "#CCCCCC", label: "Website Microinteractions", width: 750, height: 560 },
                { id: "asset-3-2", row: 3, slot: 2, type: "image", src: "/img/workspane/pane-11-viry.webm", label: "Scientific Visualization", width: 850, height: 560 },
                { id: "text-3-3", row: 3, slot: 3, type: "text", text: "Human expertise scaled by AI. Models accelerate research, while our team protects and refines your brand voice.", width: 750, height: 560 },
                { id: "asset-3-4", row: 3, slot: 4, type: "image", src: "/img/workspane/pane-12-vacation.json", label: "Vacation Planner UI", width: 650, color: "#FF5A5F", height: 560 },
                { id: "asset-3-5", row: 3, slot: 5, type: "image", src: "/img/workspane/pane-01-cardblock.mp4", label: "App Flow", width: 900, height: 560 }
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
