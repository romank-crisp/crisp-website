# Deployment Guide — Crisp Headless Architecture

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Crisp Infrastructure                    │
├──────────────┬──────────────────┬────────────────────────┤
│ Public Site  │ Admin Panel      │ Contact Form           │
│ GCS Static   │ Cloud Run        │ Cloud Function         │
│ Hosting      │ (standalone)     │ (gen2 HTTP)            │
├──────────────┼──────────────────┼────────────────────────┤
│ Staging      │ crisp-admin-stg  │ contact-form-staging   │
│ Production   │ crisp-admin      │ contact-form           │
└──────────────┴──────────────────┴────────────────────────┘
```

## Prerequisites

- **gcloud CLI** authenticated: `gcloud auth login`
- **Project**: `crisp-website-485112`
- **Region**: `europe-west1`
- **Secrets in Secret Manager**: `ADMIN_PASSWORD`, `RESEND_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`

## First-Time Setup

```bash
# 1. Create GCS static hosting buckets
./setup-hosting.sh

# 2. Deploy everything to staging first
./deploy-all.sh staging all
```

## Deployment

### Deploy Everything
```bash
# Staging
./deploy-all.sh staging all

# Production
./deploy-all.sh production all
```

### Deploy Individual Components
```bash
# Static site only
./deploy-all.sh staging site

# Admin panel only
./deploy-all.sh production admin

# Contact function only
./deploy-all.sh production function
```

### Deploy from Admin Panel
The admin panel has a **Dashboard** page at `/admin/deploy` with:
- **Publish button** — triggers Cloud Build for staging or production
- **Build history** — shows recent build status and duration
- **Services status** — links to all deployed services

## Content Workflow

```
Admin CMS → Save to GCS → Publish → Cloud Build → Static HTML → GCS Bucket
```

1. Edit content in Admin panel (updates GCS JSON)
2. Click **Publish** on the Dashboard (or run `./deploy-all.sh staging site`)
3. Cloud Build: pulls content → builds static → syncs to bucket
4. Site live in ~2-4 minutes

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `pull-content.sh` | Sync GCS JSON to local `src/content/data/` |
| `pull-image.sh` | Download images from GCS |
| `setup-hosting.sh` | One-time: create GCS hosting buckets |
| `deploy-all.sh` | Deploy any/all components to staging/production |

## URLs

| Service | Staging | Production |
|---------|---------|------------|
| Public Site | `gs://crisp-website-static-staging` | `gs://crisp-website-static` |
| Admin | `crisp-admin-staging.run.app` | `crisp-admin.run.app` |
| Contact API | `contact-form-staging` | `contact-form` |
