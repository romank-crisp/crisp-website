# Project Structure Guide

This document outlines the architectural patterns used in the project, specifically focusing on templates, content management, and component blocks.

## 1. Templates (`src/templates`)

Templates serve as the master layouts for specific page types. They handle the orchestration of blocks and global page structure, keeping the actual Next.js page files (`page.tsx`) thin.

### Case Study Template
**File**: `src/templates/case-study/CaseStudyPage.tsx`

This is the primary template for all case study pages. It accepts a `CaseStudyContent` object and renders the page dynamically.

-   **Responsibility**:
    -   Renders the `HeroVideo`.
    -   Iterates through a `blocks` array to render content sections.
    -   Handles global layout elements like `StatsBlock`, `NextCaseBlock`, and footer areas.
    -   **Block Manager**: Contains a large `switch` statement that maps `block.type` (string) to a specific React component (e.g., `"text-reveal"` -> `<TextReveal />`).

---

## 2. Content Storage (`src/content`)

Content is strictly separated from logic and views. It is stored as strongly-typed TypeScript objects.

**Location**: `src/content/case-studies/`
**Example**: `src/content/case-studies/centrogreen.tsx`

### Structure
Content files export a single object (e.g., `caseStudyCentrogreen`) adhering to the `CaseStudyContent` interface.

```typescript
export const caseStudyCentrogreen: CaseStudyContent = {
    id: "centrogreen",
    hero: { ... }, // Hero configuration
    stats: { ... }, // Footer stats
    blocks: [      // Array of content blocks
        {
            id: "1",
            type: "text-reveal", // Maps to component in Template
            props: { ... }       // Props passed to component
        },
        // ...
    ]
}
```

### Page Assembly (`src/app`)
Next.js page files are minimal connectors:
```typescript
// src/app/works/centrogreen/page.tsx
import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
import { caseStudyCentrogreen } from "@/content/case-studies/centrogreen";

export default function Page() {
    return <CaseStudyPage content={caseStudyCentrogreen} />;
}
```

---

## 3. Blocks (`src/components/blocks`)

Blocks are the building units of the page. They are divided into two categories based on reusability.

### A. Global / Reusable Blocks
These blocks are generic and fully driven by props. They can be used across multiple case studies with different content.

**Examples**:
-   `TextReveal`: Generic text with scroll reveal animation.
-   `ScrollRevealImage`: Image that reveals on scroll.
-   `FeatureGrid`: Grid of features/items.
-   `VideoScrollingCTA`: Sticky video call-to-action.

**Usage**:
Add them to the `blocks` array in your content file with their specific props.

### B. Page-Specific Blocks
These blocks are highly custom and unique to a specific project's "vibe" or design requirements. They often contain hardcoded assets (like specific Lottie animations), custom interactions, or layouts that are too complex or specific to generalize.

**Examples**:
-   `CentrogreenDesignCode`: Specific interactive color palette and Lottie animations for the Centrogreen project.
-   `LogoAnimation`: Custom logo grid animation.

**Implementation Custom**:
1.  **Create Component**: Build the component in `src/components/blocks/`.
2.  **Register in Template**: Add a generic case string in `CaseStudyPage.tsx` (e.g., case `"centrogreen-designcode"`).
3.  **Add to Content**: Use that type string in your content file. These often take few or no props since they are custom-built.

---

## Summary of Workflow

1.  **New Page**: Create a file in `src/app/works/[new-slug]/page.tsx`.
2.  **New Content**: Create `src/content/case-studies/[new-slug].tsx`.
3.  **Add Blocks**:
    -   Use existing keys (`text-reveal`, `image-scroll`) for standard sections.
    -   If a unique design is needed, create a new component in `blocks/`, add a case in the Template, and reference it by `type`.
