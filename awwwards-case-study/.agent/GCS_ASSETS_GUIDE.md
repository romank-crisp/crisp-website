# GCS Assets & Content Fetching Guide

## 🪣 Bucket

Everything — content JSON **and** media files — lives in a single public GCS bucket:

```
crisp-website-485112_cloudbuild
```

Base URL:
```
https://storage.googleapis.com/crisp-website-485112_cloudbuild/
```

---

## 📂 Storage Layout

```
crisp-website-485112_cloudbuild/
├── data/                        ← Content JSON (CMS data)
│   ├── home-hero.json
│   ├── home-stats.json
│   ├── case-studies/
│   │   └── project-general.json
│   └── ...
└── img/                         ← Media assets (images, video, Lottie)
    ├── home-hero/
    │   ├── home-01.webm
    │   ├── home-hero-03.png
    │   ├── home-hero-04.json     ← Lottie animation JSON
    │   └── home-hero-05.json
    └── ...
```

> **Two different read paths for two different asset types — do not mix them up.**

---

## 📋 Type 1: Content JSON (`data/`)

These are the CMS files that drive all page content (text, layout config, asset references).

### How to read — **server-side only** via Server Action

```typescript
// src/app/actions/content.ts  ← DO NOT MODIFY
import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = "crisp-website-485112_cloudbuild";
const DATA_PREFIX  = "data";

export async function readContent(filename: string) {
    const filePath = path.join(DATA_PREFIX, filename);
    const [file] = await storage.bucket(BUCKET_NAME).file(filePath).download();
    return JSON.parse(file.toString());
}
```

Usage in a server component or page:

```typescript
// Single file
const heroData = await readContent("home-hero.json") as HomeHeroData;

// Multiple files in parallel
const [hero, stats] = await Promise.all([
    readContent("home-hero.json"),
    readContent("home-stats.json"),
]);
```

### Rules
- ✅ **Server-side only** — uses the Google Cloud SDK with service-account credentials.
- ✅ Never fetch `data/` files directly from the browser — no credentials available.
- ✅ Always cast the result to the matching TypeScript type.
- ❌ Never hardcode bucket path strings in components; always use `readContent()`.

---

## 🖼️ Type 2: Media Assets (`img/`)

Images (`.png`, `.webp`), videos (`.webm`, `.mp4`), and **Lottie JSON animations** (`.json`)
stored under `img/` are **publicly readable** via HTTPS — no SDK or credentials needed.

### `getAssetUrl()` — the single source of truth

```typescript
// src/lib/utils.ts
export function getAssetUrl(path: string | undefined): string {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `https://storage.googleapis.com/crisp-website-485112_cloudbuild/${cleanPath}`;
}
```

| Input | Output |
|-------|--------|
| `/img/home-hero/home-01.webm` | `https://storage.googleapis.com/…/img/home-hero/home-01.webm` |
| `https://storage.googleapis.com/…/img/…` | unchanged (already absolute) |
| `undefined` | `""` |

### Rules
- ✅ **Always** call `getAssetUrl(path)` before referencing any media path — even if the JSON already stores a full URL (the function is idempotent for absolute URLs).
- ✅ Store paths in content JSON as **full GCS URLs** (`https://storage.googleapis.com/…`). This makes them environment-agnostic.
- ❌ Never use local `/public/img/` paths in production. The `public/` folder is only a local-dev fallback.

---

## 🔧 CORS — Client-Side Fetch Pattern

The GCS bucket has CORS configured to allow browser-originated fetches. This applies to:

- **Lottie animation JSON** (fetched in `useEffect`, not via `<img>`)
- Any future client-side data file

### ✅ Correct pattern

```typescript
import { getAssetUrl } from "@/lib/utils";

function MyLottieComponent({ src }: { src: string }) {
    const [data, setData] = useState<unknown>(null);

    useEffect(() => {
        const url = getAssetUrl(src);   // ← always resolve first
        fetch(url)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Failed to load:", err));
    }, [src]);

    // …render
}
```

### ❌ Wrong — raw local path

```typescript
// BAD: fetch("/img/home-hero/home-hero-05.json")
// This will fail in production — the file is on GCS, not the Next.js server.
fetch(src)  // src = "/img/home-hero/home-hero-05.json"
```

---

## 🎬 Asset Type Quick Reference

| Asset | Element | Pattern |
|-------|---------|---------|
| Video (`.webm` / `.mp4`) | `<video src={…}>` | `src={cell.contentProps.videoSrc}` — URL already stored in JSON |
| Image (`.png` / `.webp`) | `<Image src={…}>` | `src={cell.contentProps.src}` — URL already stored in JSON |
| Distortion Image | `<Image src={…}>` | `src={src \|\| getAssetUrl("/img/…")}` |
| Lottie (`.json`) | `<Lottie animationData={…}>` | `fetch(getAssetUrl(src))` in `useEffect` |

---

## 📝 Content JSON — Embedding Asset References

When a content JSON file references a media asset, **always store the full GCS URL**:

```json
{
  "contentType": "video",
  "contentProps": {
    "videoSrc": "https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/home-01.webm"
  }
}
```

```json
{
  "contentType": "lottie",
  "contentProps": {
    "lottieSrc": "https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/home-hero-04.json"
  }
}
```

This keeps the JSON portable and avoids any local-vs-production path mismatch.

---

## ⚠️ Common Pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| Lottie fails in production | `fetch("/img/…")` — local path | Wrap with `getAssetUrl()` |
| Image broken in prod | Path points to `/public/` | Store full GCS URL in JSON |
| CORS error on fetch | Full GCS URL bypassed | Always use `getAssetUrl()` before `fetch()` |
| `readContent()` called client-side | Missing credentials | Move call to server component / page |

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | `getAssetUrl()` implementation |
| `src/app/actions/content.ts` | `readContent()` / `updateContent()` — do not modify |
| `.agent/JSON_FIRST_GUIDE.md` | Full JSON-first architecture guide |
| `.agent/QUICK_REFERENCE.md` | Cheat-sheet for common tasks |
