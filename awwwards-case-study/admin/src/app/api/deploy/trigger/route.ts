import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/deploy/trigger
 * 
 * Triggers a Cloud Build to rebuild and deploy the static site.
 * Supports staging and production environments.
 * 
 * Body: { environment: "staging" | "production" }
 */
export async function POST(request: NextRequest) {
    try {
        const { environment } = await request.json();

        if (!["staging", "production"].includes(environment)) {
            return NextResponse.json(
                { error: "Invalid environment. Use 'staging' or 'production'." },
                { status: 400 }
            );
        }

        const projectId = "crisp-website-485112";
        const accessToken = await getAccessToken();

        // Target bucket based on environment
        const targetBucket = environment === "production"
            ? "gs://crisp-website-static/"
            : "gs://crisp-website-static-staging/";

        const contactApiUrl = environment === "production"
            ? "https://europe-west1-crisp-website-485112.cloudfunctions.net/contact-form"
            : "https://europe-west1-crisp-website-485112.cloudfunctions.net/contact-form-staging";

        const response = await fetch(
            `https://cloudbuild.googleapis.com/v1/projects/${projectId}/builds`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    substitutions: {
                        _ENVIRONMENT: environment,
                        _TARGET_BUCKET: targetBucket,
                        _CONTACT_API_URL: contactApiUrl,
                    },
                    steps: [
                        // Step 1: Install dependencies
                        {
                            name: "node:22",
                            entrypoint: "bash",
                            args: ["-c", "cd awwwards-case-study && npm ci"],
                        },
                        // Step 2: Pull latest content from GCS
                        {
                            name: "gcr.io/cloud-builders/gsutil",
                            entrypoint: "bash",
                            args: ["-c", "cd awwwards-case-study && bash pull-content.sh"],
                        },
                        // Step 3: Build static site
                        {
                            name: "node:22",
                            entrypoint: "bash",
                            args: [
                                "-c",
                                `cd awwwards-case-study && NEXT_PUBLIC_CONTACT_API_URL=${contactApiUrl} npm run build`,
                            ],
                        },
                        // Step 4: Deploy to GCS bucket
                        {
                            name: "gcr.io/cloud-builders/gsutil",
                            args: ["-m", "rsync", "-r", "-d", "awwwards-case-study/out/", targetBucket],
                        },
                    ],
                    timeout: "600s",
                    options: {
                        machineType: "E2_HIGHCPU_8",
                    },
                    source: {
                        repoSource: {
                            projectId,
                            repoName: "github_romank-crisp_crisp-website",
                            branchName: "main",
                            dir: ".",
                        },
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Cloud Build trigger error:", error);
            return NextResponse.json(
                { error: `Failed to trigger build: ${error.error?.message || "Unknown error"}` },
                { status: 500 }
            );
        }

        const result = await response.json();
        const buildId = result.metadata?.build?.id || result.name?.split("/").pop();

        return NextResponse.json({
            success: true,
            buildId,
            environment,
            message: `${environment === "production" ? "🚀" : "🔬"} Build triggered for ${environment}. Site will update in 2-4 minutes.`,
        });
    } catch (error) {
        console.error("Trigger deploy error:", error);
        return NextResponse.json(
            { error: "Failed to trigger deployment" },
            { status: 500 }
        );
    }
}

async function getAccessToken(): Promise<string> {
    const response = await fetch(
        "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
        { headers: { "Metadata-Flavor": "Google" } }
    );
    const data = await response.json();
    return data.access_token;
}
