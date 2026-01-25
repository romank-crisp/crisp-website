# Crisp Website - Awwwards Case Study Rebuild

A high-performance, design-driven website built with Next.js, TypeScript, and Tailwind CSS. This project focuses on premium aesthetics, smooth animations (GSAP), and a flexible content architecture without a heavy CMS.

## Project Structure

The project is organized to separate content, presentation, and logic:

```bash
src/
├── app/                  # Next.js App Router (Thin wrappers)
│   ├── works/            # Case study routes
│   │   └── [slug]/       # e.g., centrogreen/page.tsx
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # Atomic UI (Button, Input, Dropdown)
│   ├── blocks/           # Reusable Content Blocks (Hero, Stats, Details)
│   └── layouts/          # Global Layouts (Navbar, SmoothScroll)
├── content/              # Single source of truth for page content
│   └── case-studies/     # Content definition files (e.g., centrogreen.ts)
├── templates/            # Page Composition Templates
│   └── case-study/       # CaseStudyPage.tsx (Renders blocks based on content)
└── types/                # Shared TypeScript Definitions
```

## Content Workflow

We use a "Code-as-Content" approach for case studies. Content is defined in typed TypeScript files, ensuring strict type safety and easy refactoring while maintaining flexibility.

### How to add a new Case Study
1.  **Duplicate a Content File**: Copy `src/content/case-studies/centrogreen.ts` to `new-project.ts`.
2.  **Edit Content**: Update text, images, and add/remove blocks in the `blocks` array.
3.  **Create Route**: Create `src/app/works/new-project/page.tsx` and import the template:
    ```tsx
    import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
    import { caseStudyNew } from "@/content/case-studies/new-project";

    export default function NewProjectPage() {
      return <CaseStudyPage content={caseStudyNew} />;
    }
    ```

See [src/content/case-studies/README.md](src/content/case-studies/README.md) for detailed block types.

## Component Architecture

-   **UI (`@/components/ui`)**: Small, functional components. Pure UI, no business logic.
-   **Blocks (`@/components/blocks`)**: Larger assembly units. These accept specific data props (e.g., `HeroVideoProps`) and handle their own internal animations.
-   **Templates (`@/templates`)**: Page-level compositions that map "Content Objects" to "Block Components".

## Styling & Animations

-   **Tailwind CSS**: Utility-first styling with custom tokens in `tailwind.config.ts`.
-   **GSAP**: Used for complex animations (SmoothScroll, TextReveals, ScrollTriggers).
-   **Fonts**: `Staatliches` (Headings) and `DM Sans` (Body).
