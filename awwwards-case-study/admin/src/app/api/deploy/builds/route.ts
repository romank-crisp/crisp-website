import { NextResponse } from "next/server";

/**
 * GET /api/deploy/builds
 * 
 * Fetches recent Cloud Build history for the project.
 * Returns the last 20 builds with status, timing, and trigger info.
 */
export async function GET() {
    try {
        const projectId = "crisp-website-485112";
        const accessToken = await getAccessToken();

        const response = await fetch(
            `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds?pageSize=20`,
            {
                headers: { "Authorization": `Bearer ${accessToken}` },
                next: { revalidate: 0 },
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error("Cloud Build API error:", error);
            return NextResponse.json({ builds: [] });
        }

        const data = await response.json();
        const builds = (data.builds || []).map((build: any) => ({
            id: build.id,
            status: build.status,
            createTime: build.createTime,
            finishTime: build.finishTime,
            duration: build.finishTime ? formatDuration(build.createTime, build.finishTime) : undefined,
            trigger: build.substitutions?._ENVIRONMENT || build.buildTriggerId ? "Trigger" : "Manual",
        }));

        return NextResponse.json({ builds });
    } catch (error) {
        console.error("Failed to fetch builds:", error);
        return NextResponse.json({ builds: [] });
    }
}

function formatDuration(start: string, end: string): string {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}m ${remaining}s`;
}

async function getAccessToken(): Promise<string> {
    const response = await fetch(
        "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
        { headers: { "Metadata-Flavor": "Google" } }
    );
    const data = await response.json();
    return data.access_token;
}
