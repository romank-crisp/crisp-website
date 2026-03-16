"use server";

import { Storage } from "@google-cloud/storage";
import path from "path";
import { revalidatePath, revalidateTag } from "next/cache";
const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET ?? "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";

export async function readContent(filename: string) {
    try {
        const filePath = path.join(DATA_PREFIX, filename);
        const [files] = await storage.bucket(BUCKET_NAME).file(filePath).download();
        return JSON.parse(files.toString());
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        throw new Error(`Failed to read content file: ${filename}`);
    }
}

export async function updateContent(filename: string, data: any) {
    try {
        const filePath = path.join(DATA_PREFIX, filename);
        await storage.bucket(BUCKET_NAME).file(filePath).save(JSON.stringify(data, null, 2));

        // Invalidate cached content for this file
        revalidateTag(`content-${filename}`, "default");

        // Revalidate all public page paths so ISR picks up changes
        const publicPaths = [
            "/",
            "/about",
            "/works",
            "/works/centrogreen",
            "/works/folkeuniversitetet",
            "/works/theytalk",
            "/service/ai-visual-content",
            "/services",
            "/contact",
            "/privacy-policy",
        ];
        for (const p of publicPaths) {
            revalidatePath(p);
        }
        // Also revalidate the root layout
        revalidatePath("/", "layout");

        return { success: true };
    } catch (error) {
        console.error(`Error updating ${filename}:`, error);
        throw new Error(`Failed to update content file: ${filename}`);
    }
}

