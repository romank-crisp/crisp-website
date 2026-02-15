# Crisp Website - Awwwards Case Study Rebuild

A high-performance, design-driven website built with Next.js, TypeScript, and Tailwind CSS. This project focuses on premium aesthetics, smooth animations (GSAP), and a **JSON-first content architecture** stored in Google Cloud Storage with an AI-powered admin interface.

---

## 🎯 Core Philosophy: JSON-First, No Hardcoded Content

**CRITICAL FOR AI AGENTS**: This project follows a strict **JSON-first architecture**. All content MUST be stored in Google Cloud Storage (GCS) as JSON files. NO hardcoded text, images, or data should exist in React components.

### ✅ DO:
- Store ALL content (text, images, links, metadata) in GCS JSON files
- Create reusable, prop-driven components that consume JSON data
- Automatically update the admin interface when adding new content files
- Use TypeScript interfaces to define JSON structure

### ❌ DON'T:
- Hardcode text strings directly in JSX
- Hardcode image paths or URLs in components
- Create components with embedded content
- Skip updating the admin sidebar when adding new JSON files

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── actions/
│   │   └── content.ts           # GCS read/write server actions
│   ├── admin/
│   │   └── page.tsx             # Admin interface
│   ├── works/                   # Case study routes
│   ├── about/                   # About page
│   └── page.tsx                 # Homepage (exports home-page.tsx)
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx     # Admin navigation (UPDATE THIS!)
│   │   └── JsonEditor.tsx       # JSON/AI editor
│   ├── ui/                      # Atomic UI components
│   ├── blocks/                  # Content blocks (data-driven)
│   └── layouts/                 # Global layouts
└── types/                       # TypeScript definitions

Google Cloud Storage (GCS):
└── data/                        # All content lives here
    ├── about.json
    ├── locations.json
    ├── services.json
    ├── clients.json
    ├── team.json
    ├── navigation.json
    ├── footer.json
    └── case-studies/
        ├── centrogreen-general.json
        ├── centrogreen-case-details.json
        └── ...
```

---

## 🏗️ Content Architecture

### Storage Layer: Google Cloud Storage

**Bucket**: `crisp-website-485112_cloudbuild`  
**Path**: All JSON files stored under `data/` prefix

#### Server Actions (`src/app/actions/content.ts`)

```typescript
// Read content from GCS
export async function readContent(filename: string)

// Write content to GCS and revalidate cache
export async function updateContent(filename: string, data: any)
```

### Content Flow

```
┌─────────────────┐
│  GCS JSON Files │ ← Single Source of Truth
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌───────┐
│ Pages  │ │ Admin │
│(Read)  │ │(R/W)  │
└────────┘ └───────┘
```

---

## 🤖 AI AGENT INSTRUCTIONS: Creating New Blocks & Content

### Step-by-Step Workflow

#### 1️⃣ **Create the JSON File in GCS**

**ALWAYS START HERE!** Before writing any code, define the content structure.

**Example**: Creating a new "Testimonials" block for the homepage

```json
// GCS: data/home-testimonials.json
{
  "sectionTitle": "What Our Clients Say",
  "testimonials": [
    {
      "id": "1",
      "quote": "Crisp transformed our digital presence.",
      "author": "Jane Doe",
      "company": "TechCorp",
      "image": "/img/testimonials/jane.jpg"
    }
  ]
}
```

**How to create**:
- Use the admin interface at `/admin` to create new JSON files
- Or manually upload to GCS bucket under `data/` prefix
- Follow existing naming conventions (kebab-case)

#### 2️⃣ **Define TypeScript Interface**

Create type definitions for the JSON structure:

```typescript
// src/types/testimonials.ts
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  image: string;
}

export interface TestimonialsData {
  sectionTitle: string;
  testimonials: Testimonial[];
}
```

#### 3️⃣ **Create the React Component**

Build a **data-driven component** that accepts props from JSON:

```typescript
// src/components/blocks/Testimonials.tsx
import { TestimonialsData } from "@/types/testimonials";

interface TestimonialsProps {
  data: TestimonialsData;
}

export function Testimonials({ data }: TestimonialsProps) {
  return (
    <section>
      <h2>{data.sectionTitle}</h2>
      {data.testimonials.map((testimonial) => (
        <div key={testimonial.id}>
          <p>{testimonial.quote}</p>
          <cite>{testimonial.author}, {testimonial.company}</cite>
        </div>
      ))}
    </section>
  );
}
```

**Key Principles**:
- ✅ Component receives ALL data via props
- ✅ No hardcoded strings or values
- ✅ Fully reusable across pages
- ✅ Type-safe with TypeScript

#### 4️⃣ **Fetch Data in Page Component**

Use the `readContent` server action:

```typescript
// src/app/home-page.tsx
import { readContent } from "@/app/actions/content";
import { Testimonials } from "@/components/blocks/Testimonials";

export default async function HomePage() {
  const testimonialsData = await readContent("home-testimonials.json");
  
  return (
    <main>
      <Testimonials data={testimonialsData} />
    </main>
  );
}
```

#### 5️⃣ **🚨 CRITICAL: Update Admin Sidebar**

**YOU MUST DO THIS!** Add the new JSON file to the admin interface.

**File**: `src/components/admin/AdminSidebar.tsx`

```typescript
const MENU_GROUPS = [
  {
    title: "Pages",
    items: [
      {
        id: "home-group",
        label: "Home Page",
        icon: FileText,
        children: [
          { id: "home-hero", label: "Hero Section" },
          { id: "home-testimonials", label: "Testimonials" }, // ← ADD THIS
        ]
      }
    ]
  }
];
```

**Naming Convention**:
- `id`: Matches the JSON filename (without `.json`)
- `label`: Human-readable name for admin UI
- Group related files under expandable sections

#### 6️⃣ **Test in Admin Interface**

1. Navigate to `/admin`
2. Find your new item in the sidebar
3. Verify JSON loads correctly
4. Test editing and saving
5. Check live preview link works

---

## 📋 Common Patterns

### Pattern 1: Page-Level Content

**Use Case**: Entire page content (About, Services, etc.)

```typescript
// Page component
const aboutData = await readContent("about.json");
return <AboutPage data={aboutData} />;
```

**Admin Sidebar**:
```typescript
{ id: "about", label: "About Page", icon: FileText }
```

### Pattern 2: Block-Level Content

**Use Case**: Reusable blocks across multiple pages

```typescript
// Multiple pages can use the same block
const clientsData = await readContent("clients.json");
return <ClientsGrid data={clientsData} />;
```

**Admin Sidebar**:
```typescript
{
  title: "Shared Blocks",
  items: [
    { id: "clients", label: "Clients Grid" }
  ]
}
```

### Pattern 3: Case Study Content

**Use Case**: Multi-file content for complex pages

```typescript
// Load multiple related files
const [general, details, stats] = await Promise.all([
  readContent("case-studies/project-general.json"),
  readContent("case-studies/project-details.json"),
  readContent("case-studies/project-stats.json"),
]);
```

**Admin Sidebar**:
```typescript
{
  id: "case-studies/project",
  label: "Project Name",
  icon: FileText,
  children: [
    { id: "case-studies/project-general.json", label: "General" },
    { id: "case-studies/project-details.json", label: "Details" },
    { id: "case-studies/project-stats.json", label: "Stats" },
  ]
}
```

---

## 🔧 Admin Interface

### Features

- **JSON Editor**: Syntax-highlighted code editor with validation
- **AI Editor**: Natural language content updates using Google Generative AI
- **Live Preview**: Direct links to view changes on the live site
- **Auto-save**: Cmd+S to save, Cmd+Enter for AI prompts
- **Toast Notifications**: Visual feedback for save status

### Admin Sidebar Structure

The sidebar is organized into logical groups:

1. **Pages**: Individual page content (About, Services, etc.)
2. **Case Studies**: Project-specific content (grouped by project)
3. **Shared**: Global elements (Navigation, Footer, reusable blocks)

**When adding new content**, determine which group it belongs to and update accordingly.

---

## 🚀 Quick Start Checklist for AI Agents

When creating a new block or page section:

- [ ] **1. Design JSON structure** - Define what data you need
- [ ] **2. Create JSON file in GCS** - Use admin or upload directly
- [ ] **3. Create TypeScript types** - Define interfaces
- [ ] **4. Build React component** - Props-driven, no hardcoded content
- [ ] **5. Fetch data in page** - Use `readContent()` server action
- [ ] **6. Update AdminSidebar.tsx** - Add to `MENU_GROUPS` array
- [ ] **7. Test in admin** - Verify editing works
- [ ] **8. Verify live site** - Check content displays correctly

---

## 🎨 Styling & Animations

- **Tailwind CSS**: Utility-first styling with custom tokens in `tailwind.config.ts`
- **GSAP**: Complex animations (SmoothScroll, TextReveals, ScrollTriggers)
- **Fonts**: `Staatliches` (Headings) and `DM Sans` (Body)

---

## 📝 File Naming Conventions

### JSON Files (GCS)
- Use **kebab-case**: `home-testimonials.json`
- Prefix with page/section: `about-team.json`, `home-hero.json`
- Group related files: `case-studies/project-name-section.json`

### React Components
- **Page files**: `[feature]-page.tsx` (e.g., `about-page.tsx`)
- **Blocks**: `PascalCase.tsx` (e.g., `Testimonials.tsx`)
- **Routing**: `page.tsx` (Next.js convention, re-exports only)

### TypeScript Types
- Match the content domain: `testimonials.ts`, `case-study.ts`
- Export interfaces with descriptive names

---

## 🔐 Environment Variables

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Google Cloud credentials are configured via Application Default Credentials (ADC).

---

## 🎯 Key Principles Summary

1. **JSON-First**: All content in GCS, zero hardcoded data
2. **Type-Safe**: TypeScript interfaces for all JSON structures
3. **Component-Driven**: Reusable, prop-based React components
4. **Admin-Friendly**: Every JSON file accessible in admin UI
5. **AI-Enhanced**: Natural language content editing
6. **Cache-Aware**: Automatic revalidation on content updates

---

**For AI Agents**: Always follow the 7-step checklist above. Never skip updating the AdminSidebar. Always prioritize JSON structure design before writing component code.
