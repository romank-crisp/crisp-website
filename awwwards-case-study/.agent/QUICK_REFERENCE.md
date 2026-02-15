# 🎯 QUICK REFERENCE CARD

## JSON-First Architecture Essentials

---

## ⚡ The Golden Rules

```
1. ALL content in GCS JSON files
2. ZERO hardcoded data in components
3. ALWAYS update AdminSidebar.tsx
4. JSON first, code second
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| **JSON Content** | GCS: `data/filename.json` |
| **TypeScript Types** | `src/types/filename.ts` |
| **React Components** | `src/components/blocks/ComponentName.tsx` |
| **Admin Config** | `src/components/admin/AdminSidebar.tsx` |
| **Server Actions** | `src/app/actions/content.ts` |

---

## 🚀 9-Step Workflow

```
1. ✏️  Design JSON structure
2. 📤 Create JSON in GCS (data/filename.json)
3. 🔷 Create TypeScript types (src/types/)
4. ⚛️  Create React component (src/components/blocks/)
5. 📥 Fetch with readContent() in page
6. ⚠️  UPDATE AdminSidebar.tsx
7. 🧪 Test in /admin
8. ✅ Verify on live site
9. 💾 Commit to git
```

---

## 📝 Code Templates

### JSON File
```json
{
  "title": "Section Title",
  "items": [
    { "id": "1", "text": "Item 1" }
  ]
}
```

### TypeScript Type
```typescript
export interface MyData {
  title: string;
  items: Array<{ id: string; text: string }>;
}
```

### React Component
```typescript
import { MyData } from "@/types/my-data";

interface MyComponentProps {
  data: MyData;
}

export function MyComponent({ data }: MyComponentProps) {
  return (
    <section>
      <h2>{data.title}</h2>
      {data.items.map(item => (
        <div key={item.id}>{item.text}</div>
      ))}
    </section>
  );
}
```

### Page Usage
```typescript
import { readContent } from "@/app/actions/content";
import { MyComponent } from "@/components/blocks/MyComponent";

export default async function Page() {
  const data = await readContent("my-data.json");
  return <MyComponent data={data} />;
}
```

### Admin Sidebar Entry
```typescript
// Simple
{ id: "my-data", label: "My Data", icon: FileText }

// Grouped
{
  id: "group-id",
  label: "Group Name",
  icon: FileText,
  children: [
    { id: "file1", label: "File 1" },
    { id: "file2", label: "File 2" },
  ]
}
```

---

## 🗂️ Admin Sidebar Groups

| Group | Use For |
|-------|---------|
| **Pages** | Page-specific content |
| **Case Studies** | Project portfolios |
| **Shared** | Reusable blocks |

---

## 📛 Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| JSON files | `kebab-case.json` | `home-hero.json` |
| TypeScript types | `kebab-case.ts` | `hero.ts` |
| React components | `PascalCase.tsx` | `Hero.tsx` |
| Page files | `[name]-page.tsx` | `home-page.tsx` |

---

## ⚠️ Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| Hardcoded text in JSX | Text from `data` prop |
| Forgot AdminSidebar update | Always update sidebar |
| Code before JSON | JSON before code |
| Missing TypeScript types | Always type your data |

---

## 🔧 Essential Commands

```bash
# Read content
const data = await readContent("filename.json");

# Read multiple
const [d1, d2] = await Promise.all([
  readContent("file1.json"),
  readContent("file2.json"),
]);

# Type-safe read
const data = await readContent("file.json") as MyType;
```

---

## 📍 Admin Sidebar Location

```typescript
// File: src/components/admin/AdminSidebar.tsx
// Line: ~11

const MENU_GROUPS = [
  {
    title: "Pages",
    items: [
      // ADD YOUR ENTRIES HERE
    ]
  }
];
```

---

## ✅ Pre-Commit Checklist

```
[ ] JSON file created in GCS
[ ] TypeScript types defined
[ ] Component created (no hardcoded content)
[ ] Used in page with readContent()
[ ] AdminSidebar.tsx updated
[ ] Tested in /admin
[ ] Verified on live site
[ ] No console errors
[ ] Responsive on mobile
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Not in admin | Update AdminSidebar.tsx |
| Won't display | Check readContent() call |
| Type errors | Match interface to JSON |
| Changes not showing | Hard refresh (Cmd+Shift+R) |

---

## 📚 Documentation

- **Overview**: `README.md`
- **AI Guide**: `.agent/JSON_FIRST_GUIDE.md`
- **Sidebar Ref**: `.agent/ADMIN_SIDEBAR_REFERENCE.md`
- **Workflow**: `.agent/workflows/create-new-block.md`
- **Index**: `.agent/INDEX.md`

---

## 🔗 Quick Links

- Admin: `http://localhost:3000/admin`
- GCS Bucket: `crisp-website-485112_cloudbuild`
- Data Path: `data/`

---

## 💡 Remember

```
JSON FIRST, CODE SECOND
NO HARDCODED CONTENT
ALWAYS UPDATE ADMIN SIDEBAR
```

---

**Print this card and keep it visible while coding!**
