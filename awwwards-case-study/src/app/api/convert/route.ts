import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import ffmpeg from "fluent-ffmpeg";

/* ─── Quality presets (matches original dev-utils settings) ──── */

const QUALITY: Record<string, { crf: number; bitrate: string }> = {
    high: { crf: 10, bitrate: "2M" },
    medium: { crf: 23, bitrate: "1M" },
    low: { crf: 35, bitrate: "500k" },
};

/* ─── Helpers ───────────────────────────────────────────────── */

function convertToWebM(
    inputPath: string,
    outputPath: string,
    settings: { crf: number; bitrate: string },
    removeAudio: boolean
): Promise<void> {
    return new Promise((resolve, reject) => {
        const outputOptions = [
            "-c:v libvpx-vp9",
            `-crf ${settings.crf}`,
            `-b:v ${settings.bitrate}`,
            "-cpu-used 2",
            "-row-mt 1",
            "-threads 0",
        ];

        if (removeAudio) {
            outputOptions.push("-an");
        } else {
            outputOptions.push("-c:a libopus", "-b:a 128k");
        }

        ffmpeg(inputPath)
            .outputOptions(outputOptions)
            .output(outputPath)
            .on("end", () => resolve())
            .on("error", (err: Error) => reject(err))
            .run();
    });
}

async function cleanup(...paths: string[]) {
    for (const p of paths) {
        try {
            await unlink(p);
        } catch {
            /* ignore */
        }
    }
}

/* ─── POST /api/convert ─────────────────────────────────────── */

export async function POST(req: NextRequest) {
    let inputPath = "";
    let outputPath = "";

    try {
        const formData = await req.formData();

        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const quality = (formData.get("quality") as string) || "medium";
        const outputName = (formData.get("outputName") as string) || "output";
        const removeAudio = formData.get("removeAudio") === "true";

        const settings = QUALITY[quality] || QUALITY.medium;

        /* Write uploaded file to a temp location */
        const tempDir = join(tmpdir(), "crisp-convert");
        await mkdir(tempDir, { recursive: true });

        const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        inputPath = join(tempDir, `input-${uniqueId}.mp4`);
        outputPath = join(tempDir, `${outputName}-${uniqueId}.webm`);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        /* Convert */
        await convertToWebM(inputPath, outputPath, settings, removeAudio);

        /* Read result and send back */
        const outputBuffer = readFileSync(outputPath);

        await cleanup(inputPath, outputPath);

        return new NextResponse(outputBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${outputName}.webm"`,
            },
        });
    } catch (error: any) {
        await cleanup(inputPath, outputPath);
        console.error("Conversion error:", error);
        return NextResponse.json(
            { error: "Conversion failed", message: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}

/* ─── App Router Route Segment Config ───────────────────────── */

// Allow up to 5 minutes for video conversion
export const maxDuration = 300;
export const dynamic = "force-dynamic";
