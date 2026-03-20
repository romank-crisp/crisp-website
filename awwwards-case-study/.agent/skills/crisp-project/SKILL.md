---
name: crisp-project
description: Consolidated project knowledge for the Crisp Website — headless static architecture, JSON-first CMS, decoupled admin panel, deployment, copywriting, and testing. Single source of truth for all AI agents and developers.
---

# Crisp Website — Project Knowledge

### 🔴 CRITICAL COMMANDMENT
**NEVER overwrite production GCS data with generated/placeholder content. NEVER use seed scripts to overwrite the LIVE JSON.**

## Architecture: Headless Static

The Crisp website uses a **decoupled headless architecture** with three independent services:

| Service | Technology | Hosting |
|---------|-----------|---------|
| **Public Site** | Next.js `output: 'export'` (static HTML) | GCS static hosting |
| **Admin Panel** | Next.js `output: 'standalone'` | Cloud Run |
| **Contact API** | Cloud Function (Gen2 HTTP) | Cloud Functions |

**Build-time content loading**: The public site reads JSON from local filesystem at build time via `readContentStatic()`. Content is synced from GCS before build via `pull-content.sh`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Animations | GSAP, Framer Motion, Lottie |
| Data | Google Cloud Storage (JSON) |
| Public Hosting | GCS static hosting (staging + production buckets) |
| Admin Hosting | Cloud Run |
| Contact API | Cloud Function (Gen2) |
| Email | Resend API |
| GCS Bucket | `crisp-website-485112_cloudbuild` |
| GCP Project | `crisp-website-485112` |
| Region | `europe-west1` |

---

## 🔴 Critical Rules

1. **ALL content in GCS JSON** — zero hardcoded text, images, or data in components.
2. **ALWAYS update admin CMS tree** (`admin/src/app/admin/page.tsx` → `CMS_TREE`) when creating new JSON files.
3. **NEVER overwrite production GCS data** with generated/placeholder content. Read first with `readContentStatic()`, ask the user for content if missing.
4. **NEVER push to `main` without a passing build.**
5. **JSON first, code second** — design the data structure before writing React.
6. **Use `readContentStatic()`** on public pages — NOT `readContent()` (that's admin-only now).

---

## 📁 Architecture

```
crisp-website/awwwards-case-study/
├── src/                            # Public site (static export)
│   ├── app/                        # Next.js App Router pages
│   │   └── [page]/page.tsx         # All use readContentStatic()
│   ├── components/
│   │   ├── blocks/                 # Content block components
│   │   ├── forms/ContactForm.tsx   # POSTs to NEXT_PUBLIC_CONTACT_API_URL
│   │   ├── layouts/                # Navbar, footer
│   │   └── ui/                     # Primitives
│   ├── content/data/               # Local mirror of GCS JSON
│   └── lib/
│       ├── content-static.ts       # ⭐ Build-time filesystem reader
│       └── content.ts              # Runtime reader (admin only)
│
├── admin/                          # Standalone admin panel
│   ├── src/app/admin/              # CMS, deploy dashboard
│   ├── src/app/api/deploy/         # Build history + trigger
│   └── Dockerfile
│
├── functions/contact/              # Cloud Function: contact form
│   └── index.js
│
├── deploy-all.sh                   # Deploy: staging/production × site/admin/function
├── setup-hosting.sh                # One-time: create GCS buckets
├── pull-content.sh                 # Sync GCS JSON → local
└── DEPLOYMENT.md                   # Full deployment guide
```

### Component Architecture Rules

- **Server Components by default.** Only use `"use client"` when hooks/interactivity are required.
- **Data flows down.** `readContentStatic()` at page level, pass as props.
- **Block components are prefixed** with their page name (`Home*`, `About*`, `CaseStudy*`) or `Shared*`.
- **Single responsibility** — keep components focused.

---

## 📡 Data Fetching

### Public Site (build-time)

```typescript
import { readContentStatic } from "@/lib/content-static";

// Runs at build time only — reads from src/content/data/
const heroData = readContentStatic("home-hero.json");
```

### Admin Panel (runtime)

```typescript
import { readContent, updateContent } from "@/app/actions/content";

// Runtime read/write to GCS
const data = await readContent("home-hero.json");
await updateContent("home-hero.json", updatedData);
```

### Media Assets

```typescript
import { getAssetUrl } from "@/lib/utils";
<video src={getAssetUrl(data.videoSrc)} />
```

Store asset paths in JSON as **full GCS URLs** (`https://storage.googleapis.com/...`).

---

## 🔁 New Block Workflow

1. Design JSON structure
2. Create JSON file in GCS (via admin or upload)
3. Pull locally: `bash pull-content.sh`
4. Create TypeScript interface (`src/types/`)
5. Create React component (`src/components/blocks/`)
6. Fetch with `readContentStatic()` in page
7. ⚠️ Update admin CMS tree in `admin/src/app/admin/page.tsx`
8. Test: `npm run build`, verify in admin
9. Publish: deploy dashboard or `./deploy-all.sh staging site`

---

## 🚀 Deployment

```bash
# Deploy everything to staging
./deploy-all.sh staging all

# Deploy static site to production
./deploy-all.sh production site

# Deploy admin panel
./deploy-all.sh production admin

# Deploy contact function
./deploy-all.sh production function
```

Admin deploy dashboard at `/admin/deploy` has publish button, build history, and services status.

---

## 🎨 Styling

- **Tailwind CSS** utility classes only (custom tokens in `tailwind.config.ts`).
- `font-heading` for headings (`Staatliches`), `font-body` for body (`DM Sans`).
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoints.
- Animations: GSAP (scroll-triggered), Framer Motion (component-level), Lottie (rich animations).

---

## ✍️ Copy & Brand Voice

Crisp Studio is a premium digital design & development studio. Voice is:

- **Direct** — short sentences, no filler.
- **Pragmatic** — workflows, constraints, results.
- **Technical, but human** — comfortable with AI/UX language.
- **Collaborative** — partner vibe, not vendor.

**Do**: Concrete nouns, numbers, active verbs.
**Don't**: "innovative", "cutting-edge", "solutions", "synergy".

| Element | Max |
|---------|-----|
| Hero headline | 7 words |
| Hero subheadline | 2 sentences |
| CTA button | 4 words |
| SEO meta description | 155 chars |

---

## 🧪 Verification Checklist

```
[ ] npm run build — no errors (all 12 pages generated)
[ ] No hardcoded content in JSX
[ ] TypeScript types defined
[ ] Admin CMS tree updated (if new JSON)
[ ] Responsive: 375px, 768px, 1440px
[ ] No console errors
[ ] All images/videos load correctly
```

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Content not in admin | Update `CMS_TREE` in `admin/src/app/admin/page.tsx` |
| Build fails: file not found | Run `bash pull-content.sh` first |
| Lottie fails in production | Wrap path with `getAssetUrl()` |
| Image broken in prod | Store full GCS URL in JSON |
| Contact form fails | Check `NEXT_PUBLIC_CONTACT_API_URL` env |
| GCS data corrupted | Restore from `src/content/data/` (git backup) |

---

## 📚 Related Files

- Content reader: `src/lib/content-static.ts`
- Admin CMS tree: `admin/src/app/admin/page.tsx` → `CMS_TREE`
- Deploy dashboard: `admin/src/app/admin/deploy/page.tsx`
- Content sync: `pull-content.sh`
- Deploy script: `deploy-all.sh`
- Env vars: `.env.example`
- Deploy guide: `DEPLOYMENT.md`
