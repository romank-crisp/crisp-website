import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand ISR revalidation endpoint.
 *
 * POST /api/revalidate
 * Headers: x-revalidation-secret: <secret>
 * Body: { paths?: string[], tags?: string[] }
 *
 * Called automatically by updateContent() after admin saves,
 * or manually via curl/webhook.
 */

export async function POST(request: NextRequest) {
    const secret = request.headers.get("x-revalidation-secret");
    const expectedSecret = process.env.REVALIDATION_SECRET;

    // If secret is configured, enforce it
    if (expectedSecret && secret !== expectedSecret) {
        return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const revalidated: { paths: string[]; tags: string[] } = {
            paths: [],
            tags: [],
        };

        if (body.paths && Array.isArray(body.paths)) {
            for (const path of body.paths) {
                revalidatePath(path);
                revalidated.paths.push(path);
            }
        }

        if (body.tags && Array.isArray(body.tags)) {
            for (const tag of body.tags) {
                revalidateTag(tag, "default");
                revalidated.tags.push(tag);
            }
        }

        // If no specific paths/tags, revalidate all public pages
        if (!body.paths && !body.tags) {
            const allPaths = [
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
            for (const p of allPaths) {
                revalidatePath(p);
                revalidated.paths.push(p);
            }
        }

        return NextResponse.json({ revalidated, success: true });
    } catch (error) {
        console.error("Revalidation error:", error);
        return NextResponse.json(
            { error: "Failed to revalidate" },
            { status: 500 }
        );
    }
}
