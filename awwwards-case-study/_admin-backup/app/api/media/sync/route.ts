import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET ?? "crisp-website-485112_cloudbuild";
const MEDIA_PREFIX = "img/";
const INDEX_PATH = "data/media-index.json";
const MEDIA_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "mp4", "webm", "mov"]);

/* ─── POST: Full rebuild of media-index.json from GCS ───────────── */

export async function POST() {
    try {
        const [allFiles] = await storage.bucket(BUCKET_NAME).getFiles({
            prefix: MEDIA_PREFIX,
        });

        const folders = new Set<string>();

        const files = allFiles
            .filter((file) => {
                const ext = file.name.split(".").pop()?.toLowerCase() || "";
                return MEDIA_EXTS.has(ext) && !file.name.endsWith("/");
            })
            .map((file) => {
                const relativePath = file.name.replace(MEDIA_PREFIX, "");
                const parts = relativePath.split("/");
                const folder = parts.length > 1 ? parts[0] : "";
                const name = parts[parts.length - 1];

                if (folder) folders.add(folder);

                // Metadata is available from the listing response — no per-file call needed
                const meta = file.metadata;

                return {
                    name,
                    path: file.name,
                    folder,
                    url: `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`,
                    size: Number(meta.size || 0),
                    contentType: String(meta.contentType || ""),
                    updated: String(meta.updated || ""),
                };
            });

        const index = {
            version: 1,
            updatedAt: new Date().toISOString(),
            folders: Array.from(folders).sort(),
            files,
        };

        await storage.bucket(BUCKET_NAME).file(INDEX_PATH).save(
            JSON.stringify(index, null, 2),
            { contentType: "application/json" }
        );

        return NextResponse.json({
            success: true,
            fileCount: files.length,
            folderCount: folders.size,
            updatedAt: index.updatedAt,
        });
    } catch (error) {
        console.error("Media sync error:", error);
        return NextResponse.json({ error: "Failed to sync media index" }, { status: 500 });
    }
}
