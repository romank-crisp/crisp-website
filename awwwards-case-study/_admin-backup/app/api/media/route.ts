import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET ?? "crisp-website-485112_cloudbuild";
const MEDIA_PREFIX = "img/";
const INDEX_PATH = "data/media-index.json";
const MEDIA_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "mp4", "webm", "mov"]);

/* ─── Index helpers ─────────────────────────────────────────────── */

interface MediaFile {
    name: string;
    path: string;
    folder: string;
    url: string;
    size: number;
    contentType: string;
    updated: string;
}

interface MediaIndex {
    version: number;
    updatedAt: string;
    folders: string[];
    files: MediaFile[];
}

async function readIndex(): Promise<MediaIndex> {
    try {
        const [content] = await storage.bucket(BUCKET_NAME).file(INDEX_PATH).download();
        return JSON.parse(content.toString());
    } catch {
        // Index doesn't exist yet — return empty
        return { version: 1, updatedAt: new Date().toISOString(), folders: [], files: [] };
    }
}

async function saveIndex(index: MediaIndex): Promise<void> {
    index.updatedAt = new Date().toISOString();
    await storage.bucket(BUCKET_NAME).file(INDEX_PATH).save(
        JSON.stringify(index, null, 2),
        { contentType: "application/json" }
    );
}

function rebuildFolders(files: MediaFile[]): string[] {
    const folders = new Set<string>();
    for (const f of files) {
        if (f.folder) folders.add(f.folder);
    }
    return Array.from(folders).sort();
}

/* ─── GET: Read from index ──────────────────────────────────────── */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get("folder");

        const index = await readIndex();

        // Filter by folder if requested
        const files = folder
            ? index.files.filter((f) => f.folder === folder)
            : index.files;

        return NextResponse.json({
            files,
            folders: index.folders,
            updatedAt: index.updatedAt,
        });
    } catch (error) {
        console.error("Media list error:", error);
        return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
    }
}

/* ─── POST: Upload file + patch index ───────────────────────────── */

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const folder = (formData.get("folder") as string) || "";
        const uploadedFiles: MediaFile[] = [];

        for (const [key, value] of formData.entries()) {
            if (key === "folder") continue;
            if (!(value instanceof File)) continue;

            const file = value as File;
            const destPath = folder
                ? `${MEDIA_PREFIX}${folder}/${file.name}`
                : `${MEDIA_PREFIX}${file.name}`;

            const buffer = Buffer.from(await file.arrayBuffer());

            await storage.bucket(BUCKET_NAME).file(destPath).save(buffer, {
                contentType: file.type,
                metadata: { cacheControl: "public, max-age=31536000" },
            });

            uploadedFiles.push({
                name: file.name,
                path: destPath,
                folder,
                url: `https://storage.googleapis.com/${BUCKET_NAME}/${destPath}`,
                size: file.size,
                contentType: file.type,
                updated: new Date().toISOString(),
            });
        }

        // Patch the index
        const index = await readIndex();
        index.files.push(...uploadedFiles);
        index.folders = rebuildFolders(index.files);
        await saveIndex(index);

        return NextResponse.json({
            success: true,
            urls: uploadedFiles.map((f) => f.url),
        });
    } catch (error) {
        console.error("Media upload error:", error);
        return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
    }
}

/* ─── DELETE: Remove file + patch index ─────────────────────────── */

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get("path");

        if (!filePath) {
            return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
        }

        if (!filePath.startsWith(MEDIA_PREFIX)) {
            return NextResponse.json({ error: "Invalid path" }, { status: 403 });
        }

        await storage.bucket(BUCKET_NAME).file(filePath).delete();

        // Patch the index
        const index = await readIndex();
        index.files = index.files.filter((f) => f.path !== filePath);
        index.folders = rebuildFolders(index.files);
        await saveIndex(index);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Media delete error:", error);
        return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
    }
}
