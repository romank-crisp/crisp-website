import { Storage } from "@google-cloud/storage";
import path from "path";
import { unstable_cache } from "next/cache";

const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET ?? "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";

export async function readContent(filename: string, revalidate: number = 3600) {
    return unstable_cache(
        async () => {
            try {
                const filePath = path.join(DATA_PREFIX, filename);
                const [files] = await storage.bucket(BUCKET_NAME).file(filePath).download();
                return JSON.parse(files.toString());
            } catch (error) {
                console.error(`Error reading ${filename}:`, error);
                throw new Error(`Failed to read content file: ${filename}`);
            }
        },
        [`content-${filename}`],
        {
            tags: [`content-${filename}`],
            revalidate
        }
    )();
}
