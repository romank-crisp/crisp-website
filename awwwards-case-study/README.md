# Crisp Website - Awwwards Case Study Rebuild

A high-performance, design-driven website built with Next.js, TypeScript, and Tailwind CSS. This project focuses on premium aesthetics, smooth animations (GSAP), and a flexible content architecture without a heavy CMS.

## Project Structure

The project is organized to separate content, presentation, and logic, with a specific focus on easy navigation through file naming conventions.

```bash
src/
├── app/                  # Next.js App Router (Thin wrappers & Routing)
│   ├── works/            # Case study routes
│   │   └── [slug]/       # e.g., centrogreen/
│   │       ├── page.tsx  # Next.js Route (Re-exports actual page)
│   │       └── centrogreen-page.tsx # Actual Page Logic
│   ├── design-system/    # Design System Route
│   │   ├── page.tsx      # Next.js Route
│   │   └── design-system-page.tsx
│   └── page.tsx          # Homepage Route (exports from home-page.tsx)
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

### File Naming Convention
To improve file navigation and searchability, we use a specific naming pattern for page files.
-   **Routing**: `page.tsx` exists purely to satisfy the Next.js App Router. It strictly re-exports the actual page component.
-   **Logic**: The actual React component is named `[feature]-page.tsx` (e.g., `about-page.tsx`, `centrogreen-page.tsx`).

## Content Workflow

We use a "Code-as-Content" approach for case studies. Content is defined in typed TypeScript files, ensuring strict type safety and easy refactoring while maintaining flexibility.

### How to add a new Case Study
1.  **Duplicate a Content File**: Copy `src/content/case-studies/centrogreen.ts` to `new-project.ts`.
2.  **Edit Content**: Update text, images, and add/remove blocks in the `blocks` array.
3.  **Create Route**: Create `src/app/works/new-project/` directory.
4.  **Create Page Component**: Create `new-project-page.tsx` and import the template:
    ```tsx
    import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
    import { caseStudyNew } from "@/content/case-studies/new-project";

    export default function NewProjectPage() {
      return <CaseStudyPage content={caseStudyNew} />;
    }
    ```
5.  **Create Route File**: Create `page.tsx` to expose the route:
    ```tsx
    export * from "./new-project-page";
    export { default } from "./new-project-page";
    ```

## Templates (`src/templates`)

Templates serve as the master layouts for specific page types. They handle the orchestration of blocks and global page structure, keeping the actual Next.js page files thin.

### Case Study Template
**File**: `src/templates/case-study/CaseStudyPage.tsx`

This accepts a `CaseStudyContent` object and renders the page dynamically.
-   **Block Manager**: Contains a large `switch` statement that maps `block.type` (string) to a specific React component (e.g., `"text-reveal"` -> `<TextReveal />`).

## Blocks (`src/components/blocks`)

Blocks are the building units of the page.

### A. Global / Reusable Blocks
Generic, prop-driven blocks used across multiple case studies (e.g., `TextReveal`, `ScrollRevealImage`).

### B. Page-Specific Blocks
Custom, unique blocks for specific projects that may contain hardcoded assets or complex bespoke animations (e.g., `CentrogreenDesignCode`).

## Styling & Animations

-   **Tailwind CSS**: Utility-first styling with custom tokens in `tailwind.config.ts`.
-   **GSAP**: Used for complex animations (SmoothScroll, TextReveals, ScrollTriggers).
-   **Fonts**: `Staatliches` (Headings) and `DM Sans` (Body).
