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
                { type: "image", src: "/img/workspane/pane-01-cardblock.mp4", label: "Card Interactions" },
                {
                    type: "text",
                    text: "One dedicated team for copy, design, and marketing. Consistent monthly output with zero management overhead."
                },
                { type: "image", src: "/img/workspane/pane-02-melanoma.jpg", label: "Melanoma Awareness" },
                { type: "image", src: "/img/workspane/pane-03-lingu.mp4", label: "Language App UX" },
                { type: "image", src: "/img/workspane/pane-04-lung.webm", label: "Medical Visuals" },
                { type: "image", src: "/img/workspane/pane-05-aiflower.webm", label: "Generative AI Art" },
                { type: "image", src: "/img/workspane/pane-07-discconnector.json", color: "bg-brand", label: "Connector Animation" },
                { type: "image", src: "/img/workspane/pane-06-donut.webm", label: "3D Motion Design" },
                { type: "image", src: "/img/workspane/pane-08-route.json", color: "#3B1C95", label: "Route Planner UI" },
                { type: "image", src: "/img/workspane/pane-01-cardblock.mp4", label: "Finance Dashboard" },
                { type: "image", color: "bg-gray-100", label: "Design System Specs" },
                {
                    type: "text",
                    text: "Fixed monthly scope. You define the goals; we handle end-to-end execution for a consistent, multi-channel presence."
                },
                { type: "image", src: "/img/workspane/pane-04-lung.webm", label: "Healthcare Portal" },
                { type: "image", color: "bg-brand", label: "Brand Strategy" },
                { type: "image", src: "/img/workspane/pane-05-aiflower.webm", label: "Campaign Assets" },
                { type: "image", src: "/img/workspane/pane-02-melanoma.jpg", label: "Social Media Banner" },
                {
                    type: "text",
                    text: "Human expertise scaled by AI. Models accelerate research, while our team protects and refines your brand voice."
                },
                { type: "image", src: "/img/workspane/pane-03-lingu.mp4", label: "Mobile App Presentation" }
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
