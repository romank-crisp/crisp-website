---
description: How to deploy the Crisp website (staging and production)
---

# Deploy Workflow

## Prerequisites
- `gcloud` CLI authenticated with access to project `crisp-website-485112`
- Working directory: `awwwards-case-study/`

## Architecture

The site is deployed as three independent services:
- **Public Site** → GCS static hosting bucket
- **Admin Panel** → Cloud Run
- **Contact Function** → Cloud Function (Gen2)

Each can be deployed independently to **staging** or **production**.

---

## Deploy Everything

// turbo
```bash
./deploy-all.sh staging all
```

## Deploy Individual Components

### Static Site Only

// turbo
```bash
./deploy-all.sh staging site
```

This will:
1. Pull latest content from GCS (`pull-content.sh`)
2. Build static site (`npm run build`)
3. Sync `out/` to `gs://crisp-website-static-staging/`

### Admin Panel Only

```bash
./deploy-all.sh staging admin
```

### Contact Function Only

// turbo
```bash
./deploy-all.sh staging function
```

---

## Deploy to Production

```bash
./deploy-all.sh production all
```

Or individual components:

```bash
./deploy-all.sh production site
./deploy-all.sh production admin
./deploy-all.sh production function
```

---

## Deploy from Admin Panel

The admin has a **Deploy Dashboard** at `/admin/deploy` with:
- Staging/Production environment toggle
- Publish button (triggers Cloud Build)
- Build history table

---

## First-Time Setup

If hosting buckets don't exist yet:

// turbo
```bash
./setup-hosting.sh
```

## Verification

After deploying to staging:

// turbo
```bash
curl -s -o /dev/null -w "HTTP %{http_code}" "https://storage.googleapis.com/crisp-website-static-staging/index.html"
```

Expected: `HTTP 200`
