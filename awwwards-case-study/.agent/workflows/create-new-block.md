---
description: Create a new content block with JSON storage
---

# Workflow: Create New Content Block

This workflow guides you through creating a new content block following the JSON-first architecture.

## Prerequisites

- Access to Google Cloud Storage bucket: `crisp-website-485112_cloudbuild`
- Admin interface access at `/admin`
- Understanding of the component you want to create

---

## Step 1: Design JSON Structure

**Before writing any code**, design your data structure.

### Questions to Ask:
- What text content is needed?
- What images/media are required?
- Are there any links or CTAs?
- Is this content dynamic (arrays) or static (single object)?
- Will this be reused on multiple pages?

### Example:

Creating a "Features Grid" block:

```json
{
  "sectionTitle": "Why Choose Us",
  "sectionSubtitle": "We deliver excellence",
  "features": [
    {
      "id": "1",
      "icon": "/img/icons/speed.svg",
      "title": "Lightning Fast",
      "description": "Optimized for performance"
    },
    {
      "id": "2",
      "icon": "/img/icons/design.svg",
      "title": "Beautiful Design",
      "description": "Premium aesthetics"
    }
  ],
  "backgroundColor": "white"
}
```

**Save this structure** - you'll need it in the next step.

---

## Step 2: Create JSON File in GCS

### Option A: Using Admin Interface (Recommended)

1. Navigate to `/admin` in your browser
2. You'll need to manually create the file first (see Option B), then edit via admin

### Option B: Direct Upload to GCS

```bash
# Create local JSON file first
echo '{
  "sectionTitle": "Why Choose Us",
  "features": []
}' > temp-features.json

# Upload to GCS (requires gcloud CLI)
gsutil cp temp-features.json gs://crisp-website-485112_cloudbuild/data/home-features.json

# Clean up
rm temp-features.json
```

### Naming Convention:
- Use **kebab-case**: `home-features.json`
- Prefix with page: `home-`, `about-`, etc.
- Be descriptive: `home-team-highlights.json` not `home-team.json`

---

## Step 3: Create TypeScript Interface

**File**: `src/types/[feature-name].ts`

```typescript
// src/types/features.ts

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesData {
  sectionTitle: string;
  sectionSubtitle: string;
  features: Feature[];
  backgroundColor?: string;
}
```

**Key Points**:
- Export all interfaces
- Use descriptive names
- Mark optional fields with `?`
- Match JSON structure exactly

---

## Step 4: Create React Component

**File**: `src/components/blocks/[ComponentName].tsx`

```typescript
// src/components/blocks/FeaturesGrid.tsx
"use client";

import { FeaturesData } from "@/types/features";
import Image from "next/image";

interface FeaturesGridProps {
  data: FeaturesData;
}

export function FeaturesGrid({ data }: FeaturesGridProps) {
  return (
    <section 
      className="py-24 px-8"
      style={{ backgroundColor: data.backgroundColor || 'white' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl mb-4">
            {data.sectionTitle}
          </h2>
          <p className="text-xl text-gray-600">
            {data.sectionSubtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="font-heading text-2xl mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Checklist**:
- [ ] All text from `data` prop
- [ ] All images from `data` prop
- [ ] No hardcoded values
- [ ] Proper TypeScript types
- [ ] Responsive design
- [ ] Accessible markup

---

## Step 5: Use in Page Component

**File**: `src/app/[page-name]/page.tsx`

```typescript
// src/app/page.tsx
import { readContentStatic } from "@/lib/content-static";
import { FeaturesGrid } from "@/components/blocks/FeaturesGrid";
import { FeaturesData } from "@/types/features";

export default async function HomePage() {
  // Read from local JSON (synced from GCS before build)
  const featuresData = readContentStatic("home-features.json") as FeaturesData;
  
  return (
    <main>
      {/* Other sections */}
      
      <FeaturesGrid data={featuresData} />
      
      {/* Other sections */}
    </main>
  );
}
```

**Key Points**:
- Use `readContentStatic()` (NOT `readContent()` — that's admin-only now)
- Runs at build time, reads from `src/content/data/`
- Pull content first: `bash pull-content.sh`
- Type cast with `as YourType`

---

## Step 6: 🚨 Update Admin CMS Tree

**File**: `admin/src/app/admin/page.tsx`

### Determine Correct Group:

| If your content is... | Add to group... |
|----------------------|-----------------|
| Page-specific (only on one page) | **Pages** |
| A case study/project | **Case Studies** |
| Reusable across multiple pages | **Shared** |

### Add Entry:

```typescript
// admin/src/app/admin/page.tsx

const CMS_TREE: TreeGroup[] = [
  {
    title: "Pages",
    items: [
      {
        id: "home-group",
        label: "Home Page",
        icon: FileText,
        children: [
          { id: "home-hero.json", label: "Hero Section" },
          { id: "home-features.json", label: "Features Grid" }, // ← ADD THIS
        ]
      }
    ]
  },
  // ... other groups
];
```

**Rules**:
- `id` matches JSON filename (include `.json`)
- `label` is human-readable
- The admin panel is in the `admin/` directory (not `src/`)

---

## Step 7: Test in Admin Interface

1. **Navigate to Admin** (admin runs on port 3001):
   ```
   http://localhost:3001/admin
   ```

2. **Find Your Entry**:
   - Click on the group (e.g., "Home Page")
   - Click on your new item (e.g., "Features Grid")

3. **Verify JSON Loads**:
   - Check that JSON displays correctly
   - Verify syntax highlighting works

4. **Test Editing**:
   - Modify some text
   - Press `Cmd+S` to save
   - Check for success toast notification

5. **Test AI Editor** (optional):
   - Switch to "AI Prompt" tab
   - Enter: "Make the section title more engaging"
   - Press `Cmd+Enter`
   - Verify AI suggestions appear

---

## Step 8: Verify Static Build

1. **Pull latest content and build**:
   ```bash
   bash pull-content.sh
   npm run build
   ```

2. **Check Build Output**:
   - [ ] Build completes without errors
   - [ ] All pages generated (check `out/` directory)

3. **Serve and verify locally**:
   ```bash
   npx serve out
   ```
   - [ ] Section appears in correct position
   - [ ] All text displays correctly
   - [ ] Images load properly
   - [ ] Responsive on mobile

4. **Deploy to staging**:
   ```bash
   ./deploy-all.sh staging site
   ```

---

## Step 9: Commit Changes

```bash
# Stage all new files
git add src/types/features.ts
git add src/components/blocks/FeaturesGrid.tsx
git add src/components/admin/AdminSidebar.tsx
git add src/app/home-page.tsx

# Commit with descriptive message
git commit -m "feat: add FeaturesGrid block with JSON storage

- Created home-features.json in GCS
- Added FeaturesData TypeScript interface
- Built reusable FeaturesGrid component
- Updated admin sidebar for content editing
- Integrated into homepage"

# Push to repository
git push
```

---

## Complete Checklist

Use this checklist for every new block:

```
[ ] Step 1: Designed JSON structure
[ ] Step 2: Created JSON file in GCS (data/filename.json)
[ ] Step 3: Created TypeScript types (src/types/filename.ts)
[ ] Step 4: Created React component (src/components/blocks/ComponentName.tsx)
[ ] Step 5: Used component in page with readContentStatic()
[ ] Step 6: Updated admin CMS tree
[ ] Step 7: Tested in /admin interface
[ ] Step 8: Verified on live site
[ ] Step 9: Committed changes to git
```

---

## Common Patterns

### Pattern: Simple Section

```typescript
// JSON
{
  "title": "About Us",
  "content": "We are awesome"
}

// Component
export function SimpleSection({ data }: { data: SimpleSectionData }) {
  return <section><h2>{data.title}</h2><p>{data.content}</p></section>;
}
```

### Pattern: List/Grid

```typescript
// JSON
{
  "items": [
    { "id": "1", "title": "Item 1" },
    { "id": "2", "title": "Item 2" }
  ]
}

// Component
export function ItemsGrid({ data }: { data: ItemsData }) {
  return (
    <div className="grid">
      {data.items.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  );
}
```

### Pattern: With CTA

```typescript
// JSON
{
  "title": "Get Started",
  "ctaText": "Contact Us",
  "ctaLink": "/contact"
}

// Component
import Link from "next/link";

export function CTASection({ data }: { data: CTAData }) {
  return (
    <section>
      <h2>{data.title}</h2>
      <Link href={data.ctaLink}>{data.ctaText}</Link>
    </section>
  );
}
```

---

## Troubleshooting

### JSON doesn't appear in admin
- Check AdminSidebar.tsx was updated
- Verify `id` matches filename
- Check for syntax errors in MENU_GROUPS

### Component doesn't display
- Verify `readContent()` is called
- Check TypeScript types match JSON
- Look for console errors

### Changes don't appear on site
- Run `bash pull-content.sh` to sync latest JSON
- Run `npm run build` and check output
- Deploy: `./deploy-all.sh staging site`

---

**Remember**: JSON first, code second. Always update admin sidebar. Test thoroughly before committing.
