"use server";

import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/content/data");

export async function readContent(filename: string) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const fileContent = await fs.readFile(filePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        throw new Error(`Failed to read content file: ${filename}`);
    }
}

export async function updateContent(filename: string, data: any) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
        return { success: true };
    } catch (error) {
        console.error(`Error updating ${filename}:`, error);
        throw new Error(`Failed to update content file: ${filename}`);
    }
}
