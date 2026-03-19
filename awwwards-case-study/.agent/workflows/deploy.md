---
description: How to deploy the Crisp website to Cloud Run (staging and production)
---

# Deploy Workflow

## Prerequisites
- `gcloud` CLI authenticated with access to project `crisp-website-485112`
- Working directory: `awwwards-case-study/`

## Steps

### 1. Build the Docker image via Cloud Build

// turbo
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_NEXT_PUBLIC_ADMIN_PASSWORD="crispffats",_GCS_BUCKET="crisp-website-485112_cloudbuild" \
  --project=crisp-website-485112
```

Wait for the build to complete successfully before proceeding.

### 2. Deploy to Staging

```bash
gcloud run deploy crisp-website-staging \
  --image=gcr.io/crisp-website-485112/crisp-website:latest \
  --region=europe-west1 \
  --project=crisp-website-485112
```

### 3. Verify staging

Open https://crisp-website-staging-oknyp3w6dq-ew.a.run.app and confirm the site loads correctly.

### 4. Deploy to Production (Europe)

```bash
gcloud run deploy crisp-website \
  --image=gcr.io/crisp-website-485112/crisp-website:latest \
  --region=europe-west1 \
  --project=crisp-website-485112
```

### 5. (Optional) Deploy to Production (US)

```bash
gcloud run deploy crisp-website \
  --image=gcr.io/crisp-website-485112/crisp-website:latest \
  --region=us-central1 \
  --project=crisp-website-485112
```
