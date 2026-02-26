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
        revalidateTag(`content-${filename}`, 'default');
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error(`Error updating ${filename}:`, error);
        throw new Error(`Failed to update content file: ${filename}`);
    }
}
