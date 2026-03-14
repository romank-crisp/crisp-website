---
name: crisp-project
description: Consolidated project knowledge for the Crisp Website — architecture, conventions, GCS data, admin panel, deployment, copywriting, and testing. Single source of truth for all AI agents and developers.
---

# Crisp Website — Project Knowledge

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Animations | GSAP, Framer Motion, Lottie |
| Data | Google Cloud Storage (JSON) |
| Deployment | Cloud Run via Docker |
| Domain | `new.crisp-studio.com` |
| GCS Bucket | `crisp-website-485112_cloudbuild` |
| GCP Project | `crisp-website-485112` |

---

## 🔴 Critical Rules

1. **ALL content in GCS JSON** — zero hardcoded text, images, or data in components.
2. **ALWAYS update `AdminSidebar.tsx`** when creating new JSON files.
3. **NEVER overwrite production GCS data** with generated/placeholder content. Read first with `readContent()`, ask the user for content if missing.
4. **NEVER push to `main` without a passing build.**
5. **JSON first, code second** — design the data structure before writing React.
6. Admin panel save confirmation dialog is intentional — do not remove it.

---

## 📁 Architecture

```
src/
├── app/
│   ├── actions/content.ts          ← GCS read/write (DO NOT MODIFY)
│   ├── actions/ai-editor.ts        ← AI-assisted JSON editing
│   ├── admin/page.tsx              ← Admin interface
│   └── [page]/
│       ├── page.tsx                ← Route entry (thin wrapper)
│       └── [page]-page.tsx         ← Page server component
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx        ← ⚠️ Always update when adding JSON
│   │   └── JsonEditor.tsx
│   ├── blocks/                     ← Content block components
│   │   ├── Home*.tsx               ← Home page blocks
│   │   ├── About*.tsx              ← About page blocks
│   │   ├── CaseStudy*.tsx          ← Case study blocks
│   │   ├── Shared*.tsx             ← Multi-page reusable blocks
│   │   ├── Works*.tsx              ← Works page blocks
│   │   └── [ProjectName]*.tsx      ← Project-specific blocks
│   ├── design-system/              ← Internal design reference
│   ├── forms/                      ← Contact forms
│   ├── layouts/                    ← Global layout, navbar, footer
│   ├── seo/                        ← Schema.org components
│   └── ui/                         ← Primitives (Button, Tag, etc.)
├── config/brands.ts
├── content/                        ← Git backup of GCS JSON
├── context/                        ← React contexts
├── hooks/
├── lib/
│   ├── content.ts                  ← Content helpers
│   ├── email.ts                    ← Email sending
│   ├── seo.ts                      ← SEO utilities
│   └── utils.ts                    ← getAssetUrl() and helpers
├── templates/case-study/           ← Case study page template
└── types/                          ← TypeScript interfaces
```

### Component Architecture Rules

- **Server Components by default.** Only use `"use client"` when hooks, browser APIs, or interactivity are required.
- **Data flows down.** Fetch at the highest level in Server Components, pass as props.
- **Block components are prefixed** with their page name (`Home*`, `About*`, `CaseStudy*`) or `Shared*` for multi-page blocks.
- **Single responsibility** — keep components focused, extract complex logic into custom hooks.
- **No deep prop drilling** — use React Context when components are highly disconnected.

---

## 📡 Data Fetching

### Content JSON (`data/`) — server-side only

```typescript
import { readContent } from "@/app/actions/content";

// Single file
const data = await readContent("home-hero.json") as HomeHeroData;

// Multiple files in parallel
const [hero, stats] = await Promise.all([
  readContent("home-hero.json"),
  readContent("home-stats.json"),
]);
```

### Media Assets (`img/`) — client-side via public URL

Always use `getAssetUrl()` before referencing any media path:

```typescript
import { getAssetUrl } from "@/lib/utils";

// Images/video — direct in JSX
<video src={getAssetUrl(data.videoSrc)} />

// Lottie — fetch in useEffect
const url = getAssetUrl(src);
fetch(url).then(res => res.json()).then(setData);
```

Store asset paths in JSON as **full GCS URLs** (`https://storage.googleapis.com/...`).

---

## 🔁 New Block Workflow

1. Design JSON structure
2. Create JSON file in GCS (`data/filename.json`)
3. Create TypeScript interface (`src/types/`)
4. Create React component (`src/components/blocks/`)
5. Fetch with `readContent()` in page
6. ⚠️ Update `AdminSidebar.tsx`
7. Test in `/admin`
8. Verify on live site
9. Commit to git

Full workflow detail in `.agent/workflows/create-new-block.md`.

---

## 🎨 Styling

- **Tailwind CSS** utility classes only (custom tokens in `tailwind.config.ts`).
- `font-heading` for headings, `font-body` for body text.
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoints.
- Animations: GSAP (scroll-triggered), Framer Motion (component-level), Lottie (rich animations).
- Never use inline styles unless required for dynamic values.

---

## ✍️ Copy & Brand Voice

Crisp Studio is a premium digital design & development studio. Voice is:

- **Direct** — short sentences, no filler.
- **Pragmatic** — workflows, constraints, results, not abstractions.
- **Technical, but human** — comfortable with AI/UX language, explained simply.
- **Collaborative** — partner vibe, not vendor.

**Do**: Use concrete nouns ("Figma system", "Webflow build"), numbers ("10+ years"), active verbs ("We build", "We craft").

**Don't**: "innovative", "cutting-edge", "client-oriented", "solutions", "synergy". No buzzword stacking, no exclamation marks in headlines, no passive voice.

### Copy lengths

| Element | Max |
|---------|-----|
| Hero headline | 7 words |
| Hero subheadline | 2 sentences |
| CTA button | 4 words |
| SEO meta description | 155 chars |

---

## 🐳 Deployment

```bash
# Build & push Docker image
docker buildx build --platform linux/amd64 \
  -t gcr.io/crisp-website-485112/crisp-website:$(git rev-parse --short HEAD) \
  -t gcr.io/crisp-website-485112/crisp-website:latest \
  --push .

# Deploy to Cloud Run
gcloud run deploy crisp-website \
  --image gcr.io/crisp-website-485112/crisp-website:latest \
  --platform managed --region europe-west1 --allow-unauthenticated

# Verify
curl -I https://new.crisp-studio.com

# Tag release
git tag -a v$(date +%Y%m%d%H%M) -m "deploy: $(git log -1 --pretty=%s)"
git push origin --tags
```

### Git Convention

Conventional Commits: `feat|fix|chore|refactor|docs|style|deploy(scope): description`

Branching: `main` (protected) ← `develop` ← `feature/`, `fix/`, `chore/`

---

## 🧪 Verification Checklist

```
[ ] npm run build — no errors
[ ] npm run lint — no warnings
[ ] No hardcoded content in JSX
[ ] TypeScript types defined and used
[ ] AdminSidebar.tsx updated (if new JSON)
[ ] Responsive: 375px, 768px, 1440px
[ ] No console errors
[ ] Admin panel: JSON loads, edits, saves
[ ] All images/videos load correctly
```

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Content not in admin | Update `AdminSidebar.tsx` |
| Lottie fails in production | Wrap path with `getAssetUrl()` |
| Image broken in prod | Store full GCS URL in JSON |
| CORS error on fetch | Use `getAssetUrl()` before `fetch()` |
| `readContent()` fails client-side | Move to server component |
| Site down | Check `gcloud run services describe crisp-website --region europe-west1` |
| GCS data corrupted | Restore from `src/content/data/` (git backup) |

---

## 📚 Related Files

- Admin panel: `src/components/admin/AdminSidebar.tsx`
- Content actions: `src/app/actions/content.ts`
- JSON data backup: `src/content/data/`
- Asset helper: `src/lib/utils.ts` (`getAssetUrl()`)
- Block workflow: `.agent/workflows/create-new-block.md`
- Dockerfile: `Dockerfile`
- Env vars: `.env.example`
