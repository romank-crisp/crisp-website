# Crisp Website — Headless Static Architecture

A high-performance portfolio website built with Next.js, TypeScript, and Tailwind CSS. The public site is **statically exported** at build time and deployed to **GCS static hosting**. Content is managed via a **decoupled admin panel** running on Cloud Run.

---

## Architecture

```
                ┌──────────────────────────────────────────────────────────┐
                │              Crisp Headless Infrastructure               │
                ├──────────────┬──────────────────┬────────────────────────┤
                │ Public Site  │ Admin Panel      │ Contact Form           │
                │ GCS Static   │ Cloud Run        │ Cloud Function         │
                │ Hosting      │ (Next.js)        │ (Gen2 HTTP)            │
                ├──────────────┼──────────────────┼────────────────────────┤
                │ Staging      │ crisp-admin-stg  │ contact-form-staging   │
                │ Production   │ crisp-admin      │ contact-form           │
                └──────────────┴──────────────────┴────────────────────────┘

Content Flow:
  Admin CMS → Save JSON to GCS → Publish → Cloud Build → Static HTML → GCS Bucket
```

### Three Decoupled Services

| Service | Technology | Purpose |
|---------|-----------|---------|
| **Public Site** | Next.js `output: 'export'` → GCS static hosting | 12 pre-rendered pages, served as plain HTML/CSS/JS |
| **Admin Panel** | Next.js `output: 'standalone'` → Cloud Run | CMS, media gallery, AI editor, deploy dashboard |
| **Contact API** | Cloud Function (Gen2) | Form validation, spam protection, email via Resend |

---

## 🔴 Critical Rules for AI Agents

1. **ALL content in GCS JSON** — zero hardcoded text, images, or data in components.
2. **NEVER overwrite production GCS data** with generated/placeholder content. Read first with `readContentStatic()`, ask the user for content if missing.
3. **NEVER push to `main` without a passing build.**
4. **JSON first, code second** — design the data structure before writing React.
5. **Always update admin CMS tree** when creating new JSON files.

---

## 📁 Project Structure

```bash
crisp-website/awwwards-case-study/
├── src/                            # Public site source
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Home (→ readContentStatic)
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/page.tsx
│   │   ├── works/page.tsx
│   │   ├── works/centrogreen/page.tsx
│   │   ├── works/folkeuniversitetet/page.tsx
│   │   ├── works/theytalk/page.tsx
│   │   ├── service/ai-visual-content/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── layout.tsx              # Root layout (also uses readContentStatic)
│   ├── components/
│   │   ├── blocks/                 # Content block components (data-driven)
│   │   ├── forms/ContactForm.tsx   # POSTs to NEXT_PUBLIC_CONTACT_API_URL
│   │   ├── layouts/                # Navbar, footer, global layouts
│   │   ├── seo/                    # Schema.org components
│   │   └── ui/                     # Primitives (Button, Input, Tag, etc.)
│   ├── content/data/               # Local mirror of GCS JSON (synced by pull-content.sh)
│   ├── lib/
│   │   ├── content-static.ts       # ⭐ Build-time filesystem content reader
│   │   ├── content.ts              # Legacy runtime reader (admin only)
│   │   ├── email.ts                # Resend email helper
│   │   ├── seo.ts                  # SEO utilities
│   │   └── utils.ts                # getAssetUrl() and helpers
│   ├── types/                      # TypeScript interfaces
│   └── config/brands.ts            # Brand/client logos config
│
├── admin/                          # Standalone admin panel (separate Next.js app)
│   ├── src/app/
│   │   ├── admin/                  # CMS, media, patterns, design system
│   │   ├── admin/deploy/page.tsx   # ⭐ Deploy dashboard
│   │   ├── api/deploy/             # Build history + trigger APIs
│   │   └── api/contact/            # Contact route (admin-local testing)
│   ├── Dockerfile                  # For Cloud Run deployment
│   ├── next.config.ts              # output: 'standalone'
│   └── package.json                # Trimmed dependencies (no GSAP etc.)
│
├── functions/
│   └── contact/                    # Cloud Function for contact form
│       ├── index.js                # HTTP handler (validation, honeypot, Resend)
│       └── package.json            # @google-cloud/functions-framework
│
├── out/                            # Static build output (gitignored)
├── public/                         # Static assets (images, fonts, sitemap)
│   ├── sitemap.xml                 # Static sitemap
│   └── robots.txt                  # Static robots.txt
│
├── deploy-all.sh                   # Master deploy: staging/production × site/admin/function
├── setup-hosting.sh                # One-time: create GCS static hosting buckets
├── pull-content.sh                 # Sync GCS JSON → local src/content/data/
├── pull-image.sh                   # Download images from GCS
├── push-image.sh                   # Upload images to GCS
├── next.config.ts                  # output: 'export', images: unoptimized
├── DEPLOYMENT.md                   # Deployment guide
└── .env.example                    # Environment variables reference
```

---

## 📡 Data Fetching

### Public Site: Build-Time Static Reads

All public pages use `readContentStatic()` which reads JSON from the local filesystem during `next build`. The JSON files are synced from GCS before build via `pull-content.sh`.

```typescript
import { readContentStatic } from "@/lib/content-static";

// In any page component (runs at build time only)
const heroData = readContentStatic("home-hero.json");
const [about, team] = [
  readContentStatic("about.json"),
  readContentStatic("team.json"),
];
```

### Admin Panel: Runtime GCS Reads/Writes

The admin panel still uses runtime `readContent()` / `updateContent()` server actions that read/write directly to GCS.

```typescript
import { readContent, updateContent } from "@/app/actions/content";

const data = await readContent("home-hero.json");
await updateContent("home-hero.json", updatedData);
```

### Media Assets

Always use `getAssetUrl()` before referencing any media path:

```typescript
import { getAssetUrl } from "@/lib/utils";

<video src={getAssetUrl(data.videoSrc)} />
```

---

## 🔁 New Block Workflow

1. **Design JSON structure** — define what data you need
2. **Create JSON file in GCS** — use admin panel or upload directly
3. **Pull locally** — run `bash pull-content.sh`
4. **Create TypeScript interface** — in `src/types/`
5. **Create React component** — in `src/components/blocks/`, props-driven
6. **Fetch with `readContentStatic()`** — in the page server component
7. **Update admin CMS tree** — in `admin/src/app/admin/page.tsx` (`CMS_TREE`)
8. **Test** — `npm run build` must pass, verify in `/admin`
9. **Publish** — use deploy dashboard or `./deploy-all.sh staging site`

---

## 🚀 Deployment

### Quick Reference

```bash
# Deploy everything to staging
./deploy-all.sh staging all

# Deploy static site to production
./deploy-all.sh production site

# Deploy admin to production
./deploy-all.sh production admin

# Deploy contact function
./deploy-all.sh production function
```

### From Admin Panel

The admin has a **Deploy Dashboard** at `/admin/deploy` with:
- **Staging/Production** environment toggle
- **Publish** button → triggers Cloud Build
- **Build history** table with auto-polling
- **Services status** cards with links

### Content Workflow

```
Admin saves JSON → GCS updated → Publish → Cloud Build → Static HTML → GCS Bucket
```

Typical latency: **2–4 minutes** from publish to live.

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide.

---

## 🔧 Environment Variables

```bash
# GCS bucket for content storage
GCS_BUCKET=your_gcs_bucket_name

# Admin password (HTTP Basic Auth on /admin)
ADMIN_PASSWORD=your_admin_password

# Gemini AI API key (admin AI editor)
GOOGLE_GENERATIVE_AI_API_KEY=your_key

# Resend email API key (contact form)
RESEND_API_KEY=your_key

# Contact form Cloud Function URL (public site)
NEXT_PUBLIC_CONTACT_API_URL=https://europe-west1-PROJECT.cloudfunctions.net/contact-form
```

---

## 🎨 Styling & Animations

| Layer | Technology |
|-------|-----------|
| CSS | Tailwind CSS (custom tokens in `tailwind.config.ts`) |
| Fonts | `Staatliches` (headings), `DM Sans` (body) |
| Scroll animations | GSAP + ScrollTrigger |
| Component animations | Framer Motion |
| Rich animations | Lottie |

---

## 📋 Key Principles

1. **JSON-First** — all content in GCS JSON, zero hardcoded data
2. **Static by Default** — public site is pre-rendered HTML, no server runtime
3. **Decoupled** — admin, public site, and API are independent services
4. **Type-Safe** — TypeScript interfaces for all JSON structures
5. **Build-Time Content** — `readContentStatic()` reads from local filesystem at build time
6. **Deploy via Dashboard** — admin panel has a publish button for staging/production
