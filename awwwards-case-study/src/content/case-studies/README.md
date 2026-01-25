# Case Study Content Workflow

This project uses a file-based content approach for case studies, separating content from the page layout.

## How to create a new case study page

1.  **Create Content File**
    Create a new file in `src/content/case-studies/[slug].ts`.
    Copy the structure from an existing case study (e.g., `centrogreen.ts`).

    ```typescript
    import { CaseStudyContent } from "@/types/case-study";

    export const caseStudyNew: CaseStudyContent = {
      slug: "new-project",
      meta: { title: "New Project", description: "..." },
      hero: { ... },
      details: { ... },
      stats: { ... },
      blocks: [
        // Add content blocks here
        {
          type: "text-reveal",
          id: "intro",
          props: { text: "..." }
        },
        // ...
      ]
    };
    ```

2.  **Create Page Route**
    Create a new directory `src/app/works/[slug]/page.tsx`.
    Import the template and your content file.

    ```typescript
    import { CaseStudyPage } from "@/templates/case-study/CaseStudyPage";
    import { caseStudyNew } from "@/content/case-studies/new-project";

    export default function NewProjectPage() {
      return <CaseStudyPage content={caseStudyNew} />;
    }
    ```

3.  **Add to Navigation**
    Update `src/app/page.tsx` or other navigation links to point to `/works/new-project`.

## Available Blocks
- `text-reveal`: Large text animation
- `image-scroll`: Full width or centered image with scroll reveal
- `image-grid-hover`: Interactive hover grid (usually for intro)
- `grid-2-col`: Two side-by-side images
- `grid-3-col`: Three side-by-side images
- `feature-grid`: Grid of text cards (e.g., problems or features)
- `process-steps`: Step-by-step list (e.g., "How it works")
- `pricing-table`: Pricing tiers with features list
- `content-split`: 50/50 Text + Image layout
