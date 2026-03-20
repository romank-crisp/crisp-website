# Headless Static Architecture

## Overview

The Crisp website was migrated from a **server-side rendered (SSR) monolith** on Cloud Run to a **decoupled headless static architecture** with three independent services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  Crisp Headless Architecture                     │
│                                                                  │
│  ┌──────────────┐    ┌───────────────┐    ┌──────────────────┐  │
│  │ Public Site   │    │ Admin Panel   │    │ Contact API      │  │
│  │              │    │               │    │                  │  │
│  │ Next.js      │    │ Next.js       │    │ Cloud Function   │  │
│  │ Static Export │    │ Standalone    │    │ Gen2 HTTP        │  │
│  │              │    │               │    │                  │  │
│  │ → GCS Bucket │    │ → Cloud Run   │    │ → Serverless     │  │
│  └──────────────┘    └───────┬───────┘    └──────────────────┘  │
│                              │                                   │
│                       ┌──────┴──────┐                           │
│                       │ GCS Bucket  │                           │
│                       │ JSON Content│                           │
│                       │ + Media     │                           │
│                       └─────────────┘                           │
└─────────────────────────────────────────────────────────────────┘

Content Workflow:
  Admin → Save JSON → GCS → Publish → Cloud Build → Static HTML → GCS Bucket
```

## Before vs After

| Aspect | Before (SSR Monolith) | After (Headless Static) |
|--------|----------------------|------------------------|
| **Hosting** | Cloud Run (always-on server) | GCS static hosting (no server) |
| **Build time** | 5–8 minutes (Docker + SSR) | ~10 seconds (static export) |
| **Page generation** | Every request (SSR + force-dynamic) | Build time only (261ms for 12 pages) |
| **Content reads** | Runtime GCS API call per request | Build-time filesystem read |
| **Admin panel** | Built-in `/admin` route | Standalone Cloud Run service |
| **API routes** | Bundle with main app | Standalone Cloud Function |
| **Cold starts** | 2–5 seconds | None (static files) |
| **CDN** | None | GCS CDN |
| **Cost** | ~$35–85/mo | ~$10–22/mo |
| **Deploy environments** | Single (Cloud Run) | Staging + Production |

## Services

### 1. Public Site
- **Technology**: Next.js `output: 'export'`
- **Hosting**: GCS static hosting buckets
- **Content**: Build-time reads from local JSON (`readContentStatic()`)
- **Build**: 12 pages pre-rendered in ~261ms
- **Deploy**: `./deploy-all.sh [staging|production] site`

### 2. Admin Panel
- **Technology**: Next.js `output: 'standalone'`
- **Hosting**: Cloud Run (low traffic, minimal resources)
- **Content**: Runtime read/write to GCS (`readContent()` / `updateContent()`)
- **Features**:
  - CMS editor (JSON + GUI modes)
  - AI-assisted editing (Gemini)
  - Media gallery
  - Design system browser
  - **Deploy dashboard** with publish button and build history
- **Deploy**: `./deploy-all.sh [staging|production] admin`

### 3. Contact API
- **Technology**: Cloud Function (Gen2 HTTP)
- **Features**: Form validation, honeypot spam protection, rate limiting, email via Resend
- **CORS**: Configured per environment
- **Deploy**: `./deploy-all.sh [staging|production] function`

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/content-static.ts` | Build-time filesystem JSON reader |
| `pull-content.sh` | Sync 58 JSON files from GCS to local |
| `next.config.ts` | `output: 'export'`, `images: { unoptimized: true }` |
| `admin/src/app/admin/deploy/page.tsx` | Deploy dashboard (publish + build history) |
| `admin/src/app/api/deploy/trigger/route.ts` | Cloud Build trigger API |
| `functions/contact/index.js` | Contact form Cloud Function |
| `deploy-all.sh` | Master deploy script (staging/production) |
| `setup-hosting.sh` | One-time GCS hosting bucket setup |

## Deployment

### Environments

| Service | Staging | Production |
|---------|---------|------------|
| Public Site | `gs://crisp-website-static-staging` | `gs://crisp-website-static` |
| Admin | `crisp-admin-staging.run.app` | `crisp-admin.run.app` |
| Contact API | `contact-form-staging` | `contact-form` |

### Quick Commands

```bash
./deploy-all.sh staging all         # Everything to staging
./deploy-all.sh production all      # Everything to production
./deploy-all.sh production site     # Static site only
./deploy-all.sh staging admin       # Admin panel only
./deploy-all.sh production function # Contact function only
```

### Content Publish Flow

1. Edit content in Admin CMS (saves JSON to GCS)
2. Click **Publish** on deploy dashboard (or run `./deploy-all.sh staging site`)
3. Cloud Build: pull content → `npm run build` → sync `out/` to GCS bucket
4. Site live in ~2–4 minutes
