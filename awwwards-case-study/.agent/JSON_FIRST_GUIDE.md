# AI Agent Guide: JSON-First Content Architecture

## 🎯 Mission Critical Rules

### Rule #1: NO HARDCODED CONTENT
**NEVER** put text, images, or data directly in React components. **ALL** content must live in GCS JSON files.

### Rule #2: ALWAYS UPDATE ADMIN SIDEBAR
When you create a new JSON file, you **MUST** update `src/components/admin/AdminSidebar.tsx`. No exceptions.

### Rule #3: JSON FIRST, CODE SECOND
Always design the JSON structure before writing any React code.

---

## 📖 Complete Workflow Example

Let's walk through creating a new "Team Highlights" section for the homepage.

### Step 1: Design JSON Structure

First, think about what data you need:

```json
{
  "title": "Meet Our Team",
  "subtitle": "Experts in digital transformation",
  "members": [
    {
      "id": "1",
      "name": "John Doe",
      "role": "Creative Director",
      "image": "/img/team/john.jpg",
      "bio": "15 years of experience in digital design"
    }
  ],
  "ctaText": "Join Our Team",
  "ctaLink": "/careers"
}
```

### Step 2: Create JSON File in GCS

**Option A: Via Admin Interface**
1. Go to `/admin`
2. Create new file: `home-team-highlights.json`
3. Paste the JSON structure
4. Save

**Option B: Direct Upload**
Upload to GCS bucket `crisp-website-485112_cloudbuild` under path `data/home-team-highlights.json`

### Step 3: Create TypeScript Types

```typescript
// src/types/team-highlights.ts
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface TeamHighlightsData {
  title: string;
  subtitle: string;
  members: TeamMember[];
  ctaText: string;
  ctaLink: string;
}
```

### Step 4: Create React Component

```typescript
// src/components/blocks/TeamHighlights.tsx
"use client";

import { TeamHighlightsData } from "@/types/team-highlights";
import Image from "next/image";
import Link from "next/link";

interface TeamHighlightsProps {
  data: TeamHighlightsData;
}

export function TeamHighlights({ data }: TeamHighlightsProps) {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-5xl mb-4">{data.title}</h2>
        <p className="text-xl text-gray-600 mb-12">{data.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg p-6">
              <Image
                src={member.image}
                alt={member.name}
                width={300}
                height={300}
                className="rounded-full mb-4"
              />
              <h3 className="font-heading text-2xl mb-2">{member.name}</h3>
              <p className="text-brand mb-3">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href={data.ctaLink}
            className="inline-block bg-black text-white px-8 py-4 rounded-lg"
          >
            {data.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Key Points**:
- ✅ All text comes from `data` prop
- ✅ All images from `data.members[].image`
- ✅ All links from `data.ctaLink`
- ✅ Component is 100% reusable

### Step 5: Use in Page Component

```typescript
// src/app/home-page.tsx
import { readContent } from "@/app/actions/content";
import { TeamHighlights } from "@/components/blocks/TeamHighlights";
import { TeamHighlightsData } from "@/types/team-highlights";

export default async function HomePage() {
  // Fetch from GCS
  const teamData = await readContent("home-team-highlights.json") as TeamHighlightsData;
  
  return (
    <main>
      {/* Other sections */}
      <TeamHighlights data={teamData} />
      {/* Other sections */}
    </main>
  );
}
```

### Step 6: 🚨 UPDATE ADMIN SIDEBAR 🚨

**THIS IS MANDATORY!**

```typescript
// src/components/admin/AdminSidebar.tsx
import { FileText, Users } from "lucide-react";

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
          { id: "home-team-highlights", label: "Team Highlights" }, // ← ADD THIS LINE
          { id: "home-testimonials", label: "Testimonials" },
        ]
      },
      // ... other items
    ]
  },
  // ... other groups
];
```

**What you added**:
- `id: "home-team-highlights"` - matches filename (without `.json`)
- `label: "Team Highlights"` - human-readable name for admin UI

### Step 7: Test Everything

1. **Admin Interface**:
   - Go to `/admin`
   - Click "Home Page" → "Team Highlights"
   - Verify JSON loads
   - Edit some text
   - Save (Cmd+S)
   - Check for success toast

2. **Live Site**:
   - Navigate to homepage
   - Verify section displays correctly
   - Check that edited content appears

---

## 🔍 Common Patterns & Examples

### Pattern: Simple Page Content

**Use Case**: Single JSON file for entire page

```typescript
// 1. JSON: data/services.json
{
  "pageTitle": "Our Services",
  "services": [...]
}

// 2. Component: src/components/blocks/ServicesPage.tsx
export function ServicesPage({ data }: { data: ServicesData }) {
  return <div>{data.pageTitle}...</div>;
}

// 3. Page: src/app/services/page.tsx
const servicesData = await readContent("services.json");
return <ServicesPage data={servicesData} />;

// 4. Admin Sidebar:
{ id: "services", label: "Services Page", icon: Briefcase }
```

### Pattern: Multi-File Complex Page

**Use Case**: Case study with multiple JSON files

```typescript
// 1. JSON Files:
// - data/case-studies/project-general.json
// - data/case-studies/project-details.json
// - data/case-studies/project-stats.json

// 2. Page: src/app/works/project/page.tsx
const [general, details, stats] = await Promise.all([
  readContent("case-studies/project-general.json"),
  readContent("case-studies/project-details.json"),
  readContent("case-studies/project-stats.json"),
]);

// 3. Admin Sidebar:
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

### Pattern: Shared/Reusable Block

**Use Case**: Same block used on multiple pages

```typescript
// 1. JSON: data/clients.json
{
  "title": "Our Clients",
  "logos": [...]
}

// 2. Component: src/components/blocks/ClientsGrid.tsx
export function ClientsGrid({ data }: { data: ClientsData }) {
  return <div>...</div>;
}

// 3. Use on multiple pages:
// - About page: const clients = await readContent("clients.json");
// - Works page: const clients = await readContent("clients.json");

// 4. Admin Sidebar (under "Shared"):
{
  title: "Shared",
  items: [
    { id: "clients", label: "Clients Grid", icon: Users }
  ]
}
```

---

## 🎨 Admin Sidebar Organization Guide

### Group 1: Pages
For page-specific content that appears on a single page.

```typescript
{
  title: "Pages",
  items: [
    {
      id: "home-group",
      label: "Home Page",
      icon: FileText,
      children: [
        { id: "home-hero", label: "Hero Section" },
        { id: "home-services", label: "Services Section" },
      ]
    },
    { id: "about", label: "About Page", icon: FileText },
  ]
}
```

### Group 2: Case Studies
For project-specific content, grouped by project.

```typescript
{
  title: "Case Studies",
  items: [
    {
      id: "case-studies/projectname",
      label: "Project Name",
      icon: FileText,
      children: [
        { id: "case-studies/projectname-general.json", label: "General" },
        { id: "case-studies/projectname-details.json", label: "Details" },
      ]
    }
  ]
}
```

### Group 3: Shared
For global/reusable content used across multiple pages.

```typescript
{
  title: "Shared",
  items: [
    { id: "navigation", label: "Navigation", icon: Navigation },
    { id: "footer", label: "Footer", icon: LayoutTemplate },
    { id: "clients", label: "Clients Grid", icon: Users },
  ]
}
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ WRONG: Hardcoded Content

```typescript
// BAD - Don't do this!
export function Hero() {
  return (
    <section>
      <h1>Welcome to Crisp</h1>
      <p>We create amazing websites</p>
    </section>
  );
}
```

### ✅ CORRECT: Data-Driven Content

```typescript
// GOOD - Do this!
export function Hero({ data }: { data: HeroData }) {
  return (
    <section>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </section>
  );
}
```

### ❌ WRONG: Forgot to Update Admin

```typescript
// Created new JSON file: home-features.json
// Created component: Features.tsx
// Used in page ✓
// Updated AdminSidebar.tsx ✗ ← FORGOT THIS!
```

### ✅ CORRECT: Complete Workflow

```typescript
// 1. Created JSON: home-features.json ✓
// 2. Created types: features.ts ✓
// 3. Created component: Features.tsx ✓
// 4. Used in page ✓
// 5. Updated AdminSidebar.tsx ✓ ← DID THIS!
```

---

## 🚀 Quick Reference Checklist

Every time you create new content:

```
[ ] 1. Design JSON structure
[ ] 2. Create JSON file in GCS (data/filename.json)
[ ] 3. Create TypeScript interface (src/types/filename.ts)
[ ] 4. Create React component (src/components/blocks/ComponentName.tsx)
[ ] 5. Fetch data with readContent() in page
[ ] 6. UPDATE src/components/admin/AdminSidebar.tsx
[ ] 7. Test in /admin
[ ] 8. Verify on live site
```

---

## 📚 File Naming Conventions

### JSON Files (in GCS)
- **Format**: `kebab-case.json`
- **Examples**:
  - `home-hero.json`
  - `about-team.json`
  - `case-studies/project-general.json`

### TypeScript Types
- **Format**: `kebab-case.ts`
- **Examples**:
  - `hero.ts`
  - `team.ts`
  - `case-study.ts`

### React Components
- **Format**: `PascalCase.tsx`
- **Examples**:
  - `Hero.tsx`
  - `TeamHighlights.tsx`
  - `CaseStudyHero.tsx`

### Page Files
- **Format**: `[feature]-page.tsx`
- **Examples**:
  - `home-page.tsx`
  - `about-page.tsx`
  - `centrogreen-page.tsx`

---

## 🔧 Useful Code Snippets

### Reading Single JSON File

```typescript
const data = await readContent("filename.json");
```

### Reading Multiple JSON Files

```typescript
const [data1, data2, data3] = await Promise.all([
  readContent("file1.json"),
  readContent("file2.json"),
  readContent("file3.json"),
]);
```

### Type-Safe Data Fetching

```typescript
import { MyDataType } from "@/types/my-data";

const data = await readContent("my-data.json") as MyDataType;
```

### Admin Sidebar Entry (Simple)

```typescript
{ id: "filename", label: "Display Name", icon: IconName }
```

### Admin Sidebar Entry (Grouped)

```typescript
{
  id: "group-id",
  label: "Group Name",
  icon: IconName,
  children: [
    { id: "file1", label: "File 1" },
    { id: "file2", label: "File 2" },
  ]
}
```

---

## 💡 Pro Tips

1. **Start with JSON**: Always design your data structure first
2. **Keep it DRY**: Reuse components across pages when possible
3. **Type Everything**: Use TypeScript interfaces for all JSON structures
4. **Test Admin First**: Verify JSON editing works before testing live site
5. **Descriptive Names**: Use clear, descriptive names for JSON files and types
6. **Group Logically**: Organize admin sidebar by page/feature/purpose

---

## 🎯 Success Criteria

You've done it right when:

- ✅ No hardcoded strings in components
- ✅ All content editable via `/admin`
- ✅ New JSON files appear in admin sidebar
- ✅ Components are reusable with different data
- ✅ TypeScript types match JSON structure
- ✅ Changes in admin reflect immediately on site

---

**Remember**: JSON first, code second. Always update the admin sidebar. No hardcoded content. Ever.
