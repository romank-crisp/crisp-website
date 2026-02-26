# 📚 Documentation Index

Welcome to the Crisp Website JSON-First Architecture documentation. This project uses Google Cloud Storage for all content, with zero hardcoded data in React components.

---

## 🎯 Core Principle

**ALL content must be stored in Google Cloud Storage as JSON files.**  
**NO hardcoded text, images, or data in React components.**  
**ALWAYS update the admin sidebar when creating new JSON files.**

---

## 📖 Documentation Files

### 1. **README.md** (Project Root)
**Purpose**: Main project documentation  
**Audience**: All developers and AI agents  
**Contains**:
- Project overview and philosophy
- Complete architecture explanation
- Step-by-step workflow for creating blocks
- Common patterns and examples
- Quick start checklist

**When to read**: First time working on the project, or when you need a complete overview.

---

### 2. **JSON_FIRST_GUIDE.md** (.agent/)
**Purpose**: Detailed AI agent instructions  
**Audience**: AI assistants and developers  
**Contains**:
- Mission-critical rules
- Complete workflow example (Team Highlights)
- Common patterns with code examples
- Admin sidebar organization guide
- Common mistakes to avoid
- Quick reference checklist

**When to read**: Before creating any new content or components.

---

### 3. **ADMIN_SIDEBAR_REFERENCE.md** (.agent/)
**Purpose**: Quick reference for updating admin interface  
**Audience**: Anyone updating AdminSidebar.tsx  
**Contains**:
- When and how to update the sidebar
- Complete examples for all scenarios
- Available icons list
- ID and label naming rules
- Common mistakes
- Decision tree for group placement

**When to read**: Every time you create a new JSON file.

---

### 4. **GCS_ASSETS_GUIDE.md** (.agent/)
**Purpose**: How media and JSON content is stored on GCS and fetched from components  
**Audience**: All developers and AI agents  
**Contains**:
- Bucket layout: `data/` (content JSON) vs `img/` (media files)
- Server-side reads via `readContent()` (content JSON only)
- Client-side reads via `getAssetUrl()` + `fetch()` (Lottie, images, video)
- CORS rules and common pitfalls
- Asset type quick reference table

**When to read**: Any time you are loading images, video, or Lottie animations in a component.

---

### 5. **create-new-block.md** (.agent/workflows/)
**Purpose**: Step-by-step workflow  
**Audience**: Developers creating new blocks  
**Contains**:
- 9-step complete workflow
- Code examples for each step
- Testing procedures
- Git commit guidelines
- Troubleshooting tips

**When to read**: When creating a new content block from scratch.

---

## 🚀 Quick Start

### For AI Agents

1. **Read**: `README.md` (5 min)
2. **Bookmark**: `JSON_FIRST_GUIDE.md` (reference)
3. **Use**: `create-new-block.md` workflow (when creating blocks)
4. **Check**: `ADMIN_SIDEBAR_REFERENCE.md` (every time)

### For Developers

1. **Understand the architecture**: Read `README.md`
2. **Follow the workflow**: Use `.agent/workflows/create-new-block.md`
3. **Update admin**: Reference `.agent/ADMIN_SIDEBAR_REFERENCE.md`
4. **Avoid mistakes**: Check `.agent/JSON_FIRST_GUIDE.md`

---

## 📋 Essential Checklists

### Creating New Content Block

```
[ ] 1. Design JSON structure
[ ] 2. Create JSON file in GCS (data/filename.json)
[ ] 3. Create TypeScript types (src/types/filename.ts)
[ ] 4. Create React component (src/components/blocks/ComponentName.tsx)
[ ] 5. Fetch data with readContent() in page
[ ] 6. UPDATE src/components/admin/AdminSidebar.tsx ⚠️
[ ] 7. Test in /admin
[ ] 8. Verify on live site
[ ] 9. Commit changes
```

### Updating Admin Sidebar

```
[ ] Opened AdminSidebar.tsx
[ ] Found correct group (Pages/Case Studies/Shared)
[ ] Added entry with correct ID (matches JSON filename)
[ ] Added human-readable label
[ ] Imported icon if needed
[ ] Checked syntax (commas, brackets)
[ ] Saved file
[ ] Tested in /admin
```

---

## 🗂️ File Structure Reference

```
Project Root/
├── README.md                          ← Main documentation
├── .agent/
│   ├── INDEX.md                       ← This file
│   ├── JSON_FIRST_GUIDE.md           ← Detailed AI guide
│   ├── ADMIN_SIDEBAR_REFERENCE.md    ← Admin update reference
│   ├── GCS_ASSETS_GUIDE.md          ← Media & content fetch patterns
│   └── workflows/
│       └── create-new-block.md       ← Step-by-step workflow
│
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── content.ts            ← GCS read/write
│   │   ├── admin/
│   │   │   └── page.tsx              ← Admin interface
│   │   └── [page]/
│   │       └── [page]-page.tsx       ← Page components
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx      ← UPDATE THIS!
│   │   │   └── JsonEditor.tsx
│   │   └── blocks/
│   │       └── [Block].tsx           ← Content blocks
│   └── types/
│       └── [type].ts                 ← TypeScript interfaces
│
└── Google Cloud Storage/
    └── data/                          ← All JSON content
        ├── [page]-[section].json
        └── case-studies/
            └── [project]-[section].json
```

---

## 🎯 Key Files to Know

### Must Update Every Time

| File | When | Why |
|------|------|-----|
| `AdminSidebar.tsx` | Creating new JSON | Make content editable in admin |
| `content.ts` | Never (already done) | GCS operations |

### Create for Each Block

| File | Purpose |
|------|---------|
| `data/[name].json` | Content storage in GCS |
| `types/[name].ts` | TypeScript interfaces |
| `blocks/[Name].tsx` | React component |

---

## 💡 Common Scenarios

### Scenario 1: New Homepage Section

**Files to create/update**:
1. `data/home-[section].json` (GCS)
2. `src/types/[section].ts`
3. `src/components/blocks/[Section].tsx`
4. `src/app/home-page.tsx` (add component)
5. `src/components/admin/AdminSidebar.tsx` (add to "Home Page" group)

**Documentation to reference**:
- `create-new-block.md` (workflow)
- `ADMIN_SIDEBAR_REFERENCE.md` (sidebar update)

---

### Scenario 2: New Case Study

**Files to create/update**:
1. `data/case-studies/[project]-general.json` (GCS)
2. `data/case-studies/[project]-details.json` (GCS)
3. `data/case-studies/[project]-stats.json` (GCS)
4. `src/app/works/[project]/[project]-page.tsx`
5. `src/components/admin/AdminSidebar.tsx` (add to "Case Studies" group)

**Documentation to reference**:
- `README.md` (Pattern 3: Case Study Content)
- `ADMIN_SIDEBAR_REFERENCE.md` (Example 3)

---

### Scenario 3: Reusable Block

**Files to create/update**:
1. `data/[block-name].json` (GCS)
2. `src/types/[block-name].ts`
3. `src/components/blocks/[BlockName].tsx`
4. Multiple page files (use in multiple places)
5. `src/components/admin/AdminSidebar.tsx` (add to "Shared" group)

**Documentation to reference**:
- `JSON_FIRST_GUIDE.md` (Pattern 2: Block-Level Content)
- `ADMIN_SIDEBAR_REFERENCE.md` (Example 4)

---

## ⚠️ Critical Reminders

### For AI Agents

1. **NEVER** hardcode content in components
2. **ALWAYS** update AdminSidebar.tsx when creating JSON files
3. **ALWAYS** design JSON structure before writing code
4. **ALWAYS** create TypeScript interfaces
5. **ALWAYS** test in `/admin` before marking complete

### For Developers

1. All content lives in GCS, not in code
2. Components are props-driven and reusable
3. Admin sidebar must reflect all JSON files
4. Follow the 9-step workflow for consistency
5. Type safety is mandatory

---

## 🔗 Quick Links

- **Admin Interface**: `/admin`
- **GCS Bucket**: `crisp-website-485112_cloudbuild`
- **Data Path**: `data/`
- **Main Config**: `src/components/admin/AdminSidebar.tsx`

---

## 📞 Need Help?

### Question: "Where do I put my content?"
**Answer**: In a JSON file in GCS under `data/`. Never in React components.

### Question: "I created a JSON file, what now?"
**Answer**: Follow the workflow in `create-new-block.md` step by step.

### Question: "My content doesn't show in admin"
**Answer**: Check `ADMIN_SIDEBAR_REFERENCE.md` - you probably forgot to update AdminSidebar.tsx.

### Question: "Can I hardcode just this one string?"
**Answer**: No. Everything goes in JSON. No exceptions.

---

## 🎓 Learning Path

### Beginner
1. Read `README.md` completely
2. Follow `create-new-block.md` to create one simple block
3. Test in admin and verify on site

### Intermediate
1. Create a multi-file case study
2. Build a reusable shared block
3. Understand admin sidebar organization

### Advanced
1. Create complex nested JSON structures
2. Build components with animations
3. Optimize GCS read patterns

---

**Last Updated**: 2026-02-15  
**Version**: 1.0.0  
**Maintained By**: Crisp Development Team

---

**Remember**: JSON first, code second. Always update the admin sidebar. No hardcoded content. Ever.
