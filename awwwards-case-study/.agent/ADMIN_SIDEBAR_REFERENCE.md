# Admin Sidebar Update Reference

## 🎯 When to Update

**EVERY TIME** you create a new JSON file in GCS, you MUST update the admin sidebar.

---

## 📍 File Location

```
src/components/admin/AdminSidebar.tsx
```

---

## 🔧 How to Update

### 1. Locate the MENU_GROUPS Array

Find this constant near the top of the file (around line 11):

```typescript
const MENU_GROUPS = [
  // ... groups here
];
```

### 2. Determine the Correct Group

Choose where your new JSON file belongs:

| Group | Purpose | Example Files |
|-------|---------|---------------|
| **Pages** | Page-specific content | `about.json`, `home-hero.json` |
| **Case Studies** | Project portfolios | `case-studies/project-*.json` |
| **Shared** | Reusable across pages | `navigation.json`, `clients.json` |

### 3. Add Your Entry

#### Simple Entry (Single File)

```typescript
{ id: "filename", label: "Display Name", icon: IconName }
```

**Example**:
```typescript
{ id: "services", label: "Services Page", icon: FileText }
```

#### Grouped Entry (Multiple Related Files)

```typescript
{
  id: "group-id",
  label: "Group Name",
  icon: FileText,
  children: [
    { id: "file1", label: "Subitem 1" },
    { id: "file2", label: "Subitem 2" },
  ]
}
```

**Example**:
```typescript
{
  id: "home-group",
  label: "Home Page",
  icon: FileText,
  children: [
    { id: "home-hero", label: "Hero Section" },
    { id: "home-services", label: "Services Section" },
  ]
}
```

---

## 📋 Complete Examples

### Example 1: Adding a New Page

**Scenario**: Created `services.json` for services page

```typescript
const MENU_GROUPS = [
  {
    title: "Pages",
    items: [
      { id: "about", label: "About Page", icon: FileText },
      { id: "services", label: "Services Page", icon: Briefcase }, // ← ADD THIS
    ]
  },
  // ... other groups
];
```

### Example 2: Adding to Existing Group

**Scenario**: Created `home-testimonials.json` for homepage

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
  },
  // ... other groups
];
```

### Example 3: Adding New Case Study

**Scenario**: Created case study files for "NewProject"

```typescript
const MENU_GROUPS = [
  {
    title: "Case Studies",
    items: [
      // ... existing case studies
      {
        id: "case-studies/newproject",
        label: "NewProject",
        icon: FileText,
        children: [
          { id: "case-studies/newproject-general.json", label: "General" },
          { id: "case-studies/newproject-details.json", label: "Details" },
          { id: "case-studies/newproject-stats.json", label: "Stats" },
        ]
      }
    ]
  },
  // ... other groups
];
```

### Example 4: Adding Shared Block

**Scenario**: Created `clients.json` for reusable clients grid

```typescript
const MENU_GROUPS = [
  {
    title: "Shared",
    items: [
      { id: "navigation", label: "Navigation", icon: Navigation },
      { id: "footer", label: "Footer", icon: LayoutTemplate },
      { id: "clients", label: "Clients Grid", icon: Users }, // ← ADD THIS
    ]
  }
];
```

---

## 🎨 Available Icons

Import icons from `lucide-react`:

```typescript
import { 
  FileText,      // Generic page/document
  Layers,        // Sections/layers
  Users,         // Team/people
  Navigation,    // Navigation menu
  LayoutTemplate,// Layout/template
  Briefcase,     // Business/services
  MapPin,        // Location
  Image,         // Images/media
  Settings,      // Configuration
  // ... many more available
} from "lucide-react";
```

---

## ⚠️ Important Rules

### ID Naming

- **Match JSON filename** (without `.json` extension)
- Use **kebab-case**
- Include path for nested files: `case-studies/project-name`

**Examples**:
```typescript
// JSON: data/home-hero.json
{ id: "home-hero", ... }

// JSON: data/case-studies/project-general.json
{ id: "case-studies/project-general.json", ... }
```

### Label Naming

- Use **Title Case**
- Make it **human-readable**
- Keep it **concise**

**Examples**:
```typescript
{ label: "Hero Section" }      // Good
{ label: "Home Hero" }          // Good
{ label: "home-hero" }          // Bad (not readable)
{ label: "HERO SECTION" }       // Bad (all caps)
```

---

## ✅ Verification Checklist

After updating AdminSidebar.tsx:

```
[ ] ID matches JSON filename (without .json)
[ ] Label is human-readable and clear
[ ] Icon is imported from lucide-react
[ ] Entry is in the correct group (Pages/Case Studies/Shared)
[ ] No syntax errors (check commas, brackets)
[ ] Saved the file
[ ] Tested in /admin interface
```

---

## 🚨 Common Mistakes

### ❌ Forgot .json in nested files

```typescript
// WRONG
{ id: "case-studies/project-general", label: "General" }

// CORRECT
{ id: "case-studies/project-general.json", label: "General" }
```

### ❌ Wrong group placement

```typescript
// WRONG - Navigation is not a page
{
  title: "Pages",
  items: [
    { id: "navigation", label: "Navigation" }
  ]
}

// CORRECT - Navigation is shared
{
  title: "Shared",
  items: [
    { id: "navigation", label: "Navigation" }
  ]
}
```

### ❌ Missing icon import

```typescript
// WRONG - Icon not imported
{ id: "services", label: "Services", icon: Briefcase }

// CORRECT - Import at top of file
import { Briefcase } from "lucide-react";
{ id: "services", label: "Services", icon: Briefcase }
```

---

## 🎯 Quick Decision Tree

```
Created new JSON file?
│
├─ Is it page-specific?
│  └─ Add to "Pages" group
│
├─ Is it a case study?
│  └─ Add to "Case Studies" group
│
└─ Is it reusable/global?
   └─ Add to "Shared" group
```

---

## 💡 Pro Tips

1. **Keep groups organized**: Don't mix page-specific and shared content
2. **Use descriptive labels**: Make it obvious what the content is
3. **Group related files**: Use children for multi-file sections
4. **Test immediately**: Check `/admin` after every update
5. **Follow patterns**: Look at existing entries for consistency

---

**Remember**: No new JSON file should exist without an admin sidebar entry!
