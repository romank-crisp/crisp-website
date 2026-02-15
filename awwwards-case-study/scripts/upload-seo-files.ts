/**
 * Script to upload SEO JSON files to Google Cloud Storage
 * Run with: npx tsx scripts/upload-seo-files.ts
 */

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

const storage = new Storage();
const BUCKET_NAME = "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";

const seoFiles = [
    "seo-home.json",
    "seo-about.json",
    "seo-services.json",
    "seo-works.json",
    "seo-contact.json",
    "seo-privacy-policy.json",
    "seo-centrogreen.json",
    "seo-folkeuniversitetet.json",
    "seo-theytalk.json",
];

async function uploadSeoFiles() {
    console.log("📤 Uploading SEO files to Google Cloud Storage (data/seo/)...\n");

    for (const filename of seoFiles) {
        try {
            const tmpPath = path.join("/tmp", filename);
            const gcsPath = path.join(DATA_PREFIX, "seo", filename);

            // Read file from /tmp
            const fileContent = fs.readFileSync(tmpPath, "utf-8");
            const data = JSON.parse(fileContent);

            // Upload to GCS
            await storage
                .bucket(BUCKET_NAME)
                .file(gcsPath)
                .save(JSON.stringify(data, null, 2));

            console.log(`✅ Uploaded: seo/${filename}`);
        } catch (error) {
            console.error(`❌ Failed to upload ${filename}:`, error);
        }
    }

    console.log("\n🎉 All SEO files uploaded to data/seo/ successfully!");
}

uploadSeoFiles().catch(console.error);
