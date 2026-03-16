import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const BUCKET_NAME = "crisp-website";
const BASE_UPLOAD_PATH =
    process.env.NODE_ENV === "production" ? "awwwards-case-study" : "awwwards-case-study";

const storage = new Storage({
    keyFilename: path.join(rootDir, "secrets/gcp.json"),
});
const bucket = storage.bucket(BUCKET_NAME);

async function uploadFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
        process.exit(1);
    }

    const relativePath = path.relative(path.join(rootDir, "public"), filePath);
    const destinationPath = path.posix.join(BASE_UPLOAD_PATH, relativePath.split(path.sep).join(path.posix.sep));

    console.log(`Uploading ${filePath} to gs://${BUCKET_NAME}/${destinationPath}...`);

    try {
        await bucket.upload(filePath, {
            destination: destinationPath,
            metadata: {
                cacheControl: "public, max-age=31536000",
            },
        });
        console.log(`Successfully uploaded to gs://${BUCKET_NAME}/${destinationPath}`);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}

const argPath = process.argv[2];
if (!argPath) {
    console.error("Please provide a file path to upload.");
    process.exit(1);
}

uploadFile(path.resolve(process.cwd(), argPath)).catch(console.error);
