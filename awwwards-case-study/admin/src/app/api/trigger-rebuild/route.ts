import { NextResponse } from "next/server";

/**
 * POST /api/trigger-rebuild
 * 
 * Triggers a Cloud Build to rebuild and redeploy the static public site.
 * Called from the admin panel after saving content changes.
 * 
 * This uses the Cloud Build API to submit a build using the existing
 * cloudbuild.yaml configuration.
 */
export async function POST() {
    try {
        // Use gcloud REST API to trigger a Cloud Build
        // The admin Cloud Run service account needs cloudbuild.builds.create permission
        const projectId = "crisp-website-485112";
        const accessToken = await getAccessToken();

        const response = await fetch(
            `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    source: {
                        repoSource: {
                            projectId,
                            repoName: "github_romank-crisp_crisp-website",
                            branchName: "main",
                            dir: "awwwards-case-study",
                        },
                    },
                    steps: [
                        {
                            name: "node:22",
                            entrypoint: "bash",
                            args: [
                                "-c",
                                "cd awwwards-case-study && npm ci && bash pull-content.sh && npm run build",
                            ],
                        },
                        {
                            name: "gcr.io/cloud-builders/gsutil",
                            args: [
                                "-m", "rsync", "-r", "-d",
                                "awwwards-case-study/out/",
                                "gs://crisp-website-static/",
                            ],
                        },
                    ],
                    timeout: "600s",
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Cloud Build API error: ${JSON.stringify(error)}`);
        }

        const result = await response.json();
        return NextResponse.json({
            success: true,
            buildId: result.metadata?.build?.id,
            message: "Rebuild triggered. Site will update in 2-4 minutes.",
        });
    } catch (error) {
        console.error("Trigger rebuild error:", error);
        return NextResponse.json(
            { error: "Failed to trigger rebuild" },
            { status: 500 }
        );
    }
}

/**
 * Get an access token from the default service account (metadata server)
 */
async function getAccessToken(): Promise<string> {
    const response = await fetch(
        "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
        { headers: { "Metadata-Flavor": "Google" } }
    );
    const data = await response.json();
    return data.access_token;
}
