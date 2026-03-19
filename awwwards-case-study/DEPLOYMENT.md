# Deployment & Infrastructure Guide

## Overview

The Crisp website is a **Next.js** application deployed on **Google Cloud Run** in project `crisp-website-485112`. The app is containerized via Docker, built with **Cloud Build**, and uses **Google Cloud Storage (GCS)** for media and content data.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│          romank-crisp/crisp-website                          │
│                                                              │
│  Branches: main, feature/admin-v2, Headless-CMS, go-growth  │
└──────────────────────┬──────────────────────────────────────┘
                       │  manual: gcloud builds submit
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Build                               │
│                                                              │
│  Config: cloudbuild.yaml                                     │
│  Image:  gcr.io/crisp-website-485112/crisp-website:latest    │
│                                                              │
│  Build args:                                                 │
│    - NEXT_PUBLIC_ADMIN_PASSWORD (baked at build time)         │
│    - GCS_BUCKET (baked at build time)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │  manual: gcloud run deploy
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloud Run Services                          │
│                                                              │
│  ┌─────────────────────────────────────────────────┐         │
│  │  crisp-website (production)                     │         │
│  │  Region: europe-west1                           │         │
│  │  URL: crisp-website-oknyp3w6dq-ew.a.run.app     │         │
│  │  ENVIRONMENT=production                         │         │
│  │  GCS_DATA_PREFIX=data                           │         │
│  │  Secrets: via Secret Manager                    │         │
│  └─────────────────────────────────────────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────┐         │
│  │  crisp-website-staging (staging)                │         │
│  │  Region: europe-west1                           │         │
│  │  URL: crisp-website-staging-oknyp3w6dq-ew.a.run.app │     │
│  │  ENVIRONMENT=staging                            │         │
│  │  GCS_DATA_PREFIX=data-staging                   │         │
│  │  Secrets: hardcoded env vars                    │         │
│  └─────────────────────────────────────────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────┐         │
│  │  awwwards-case-study (legacy/alias)             │         │
│  │  Region: europe-west1                           │         │
│  │  Same image as production                       │         │
│  └─────────────────────────────────────────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────┐         │
│  │  crisp-stud-io (separate project)               │         │
│  │  Region: europe-west1                           │         │
│  │  Uses Artifact Registry (different image)       │         │
│  └─────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Google Cloud Storage                           │
│                                                              │
│  Bucket: crisp-website-485112_cloudbuild                     │
│                                                              │
│  ├── data/              ← production content (JSON + media)  │
│  └── data-staging/      ← staging content (JSON + media)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Cloud Run Service Configuration

Both production and staging share identical resource configs:

| Setting        | Value       |
|----------------|-------------|
| CPU            | 1 vCPU      |
| Memory         | 512 Mi      |
| Max instances  | 20          |
| Concurrency    | 80          |
| Startup boost  | Enabled     |
| Port           | 3000        |

---

## Environment Variables

### Production (`crisp-website`)

| Variable                       | Source          | Value / Notes                           |
|--------------------------------|-----------------|-----------------------------------------|
| `ENVIRONMENT`                  | Env var         | `production`                            |
| `GCS_BUCKET`                   | Env var         | `crisp-website-485112_cloudbuild`        |
| `GCS_DATA_PREFIX`              | Env var         | `data`                                  |
| `ADMIN_PASSWORD`               | Secret Manager  | `latest` version                        |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Secret Manager  | `latest` version                        |
| `RESEND_API_KEY`               | Secret Manager  | `latest` version                        |

### Staging (`crisp-website-staging`)

| Variable                       | Source          | Value / Notes                           |
|--------------------------------|-----------------|-----------------------------------------|
| `ENVIRONMENT`                  | Env var         | `staging`                               |
| `GCS_BUCKET`                   | Env var         | `crisp-website-485112_cloudbuild`        |
| `GCS_DATA_PREFIX`              | Env var         | `data-staging`                          |
| `NEXT_PUBLIC_ADMIN_PASSWORD`   | Env var         | Hardcoded                               |

> **Note**: Production uses Google Secret Manager for sensitive values, while staging has them set directly as environment variables.

---

## Data Isolation

Production and staging share the **same GCS bucket** but use different prefixes:

- **Production**: `gs://crisp-website-485112_cloudbuild/data/`
- **Staging**: `gs://crisp-website-485112_cloudbuild/data-staging/`

This means content changes made in the staging admin panel do **not** affect production content, even though the same bucket is used.

---

## Deployment Process

There is **no CI/CD pipeline** — deployments are fully manual.

### Step 1: Build the Docker Image

From the `awwwards-case-study/` directory:

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_NEXT_PUBLIC_ADMIN_PASSWORD="<password>",_GCS_BUCKET="crisp-website-485112_cloudbuild" \
  --project=crisp-website-485112
```

This builds the image and pushes it to `gcr.io/crisp-website-485112/crisp-website:latest`.

### Step 2: Deploy to Staging

```bash
gcloud run deploy crisp-website-staging \
  --image=gcr.io/crisp-website-485112/crisp-website:latest \
  --region=europe-west1 \
  --project=crisp-website-485112
```

### Step 3: Deploy to Production

After verifying staging:

```bash
gcloud run deploy crisp-website \
  --image=gcr.io/crisp-website-485112/crisp-website:latest \
  --region=europe-west1 \
  --project=crisp-website-485112
```

---

## Docker Setup

The `Dockerfile` uses a multi-stage build:

1. **`deps`** — Installs `node_modules` from `package-lock.json`
2. **`builder`** — Copies source, runs `next build` with standalone output
3. **`runner`** — Production image with only standalone output + static assets

The final image runs `node server.js` on port 3000 as a non-root user.

### Build Args

| Arg                          | Purpose                                             |
|------------------------------|-----------------------------------------------------|
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Baked into the client bundle at build time           |
| `GCS_BUCKET`                 | Used during build (e.g., for static image references)|

---

## Next.js Configuration

Key settings in `next.config.ts`:

- **`output: 'standalone'`** — Required for Docker deployment
- **Remote image patterns** — Allows `storage.googleapis.com` and `images.unsplash.com`
- **Admin cache headers** — `/admin/*` routes are set to `no-store, no-cache`

---

## Cloud Run Services Summary

| Service               | Region       | Purpose                    | Image                                        |
|-----------------------|--------------|----------------------------|----------------------------------------------|
| `crisp-website`       | europe-west1 | **Production**             | `gcr.io/.../crisp-website:latest`            |
| `crisp-website`       | us-central1  | Production (US)            | `gcr.io/.../crisp-website:latest`            |
| `crisp-website-staging` | europe-west1 | **Staging / QA**          | `gcr.io/.../crisp-website:latest`            |
| `awwwards-case-study` | europe-west1 | Legacy / alias             | `gcr.io/.../crisp-website:latest`            |
| `awwwards-case-study` | us-central1  | Legacy / alias (US)        | `gcr.io/.../crisp-website:latest`            |
| `crisp-stud-io`       | europe-west1 | Separate project           | Artifact Registry image                      |

---

## Useful Commands

```bash
# Check which image a service is running
gcloud run services describe crisp-website \
  --project=crisp-website-485112 \
  --region=europe-west1 \
  --format="value(spec.template.spec.containers[0].image)"

# View recent builds
gcloud builds list --project=crisp-website-485112 --limit=5

# Stream build logs
gcloud builds log <BUILD_ID> --project=crisp-website-485112

# List all Cloud Run services
gcloud run services list --project=crisp-website-485112

# View service env vars
gcloud run services describe crisp-website \
  --project=crisp-website-485112 \
  --region=europe-west1 \
  --format="yaml(spec.template.spec.containers[0].env)"
```
