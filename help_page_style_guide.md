# Typography & Style Guide: Help & Support Page

This document provides a reference specification for the font styles, typography, color palettes, and layout components used on the **Officer Help & Support Page**. Use this blueprint to maintain visual consistency when building or editing other pages.

---

## 1. Color Palette

The interface utilizes a professional, high-contrast dark indigo theme paired with standard clean utility states (blue, green, purple, orange, red, yellow).

| Role | Color Value / Tailwind Class | Hex / Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Theme Text** | `text-[#1e1b4b]` | `#1E1B4B` (Dark Navy/Indigo) | Page headings, primary titles, brand anchors |
| **Body Primary** | `text-slate-900` | `#0F172A` | Standard form values, card texts |
| **Body Secondary** | `text-muted-foreground` | `#64748B` (Slate 500) | Subheadings, descriptions, list descriptions |
| **Required Asterisk** | `text-red-500` | `#EF4444` | Form validation indicator (`*`) |
| **Blue Accent (State)** | `text-blue-600`, `bg-blue-50`, `border-blue-500` | `#2563EB` | "User Guide" top card, information callout banners |
| **Green Accent (State)** | `text-green-600`, `bg-green-50`, `border-green-500` | `#16A34A` | "FAQs" top card, phone/email contact indicators |
| **Purple Accent (State)** | `text-purple-600`, `bg-purple-50` | `#9333EA` | "Contact Support" top card |
| **Orange Accent (State)** | `text-orange-600`, `bg-orange-50` | `#EA580C` | "Troubleshooting" top card |
| **Yellow Accent (State)** | `text-yellow-500` | `#EAB308` | Quick tip lights / bullet icon highlights |
| **Background Fill** | `bg-white` / `bg-slate-50/50` | `#FFFFFF` / `#F8FAFC` | Container backgrounds, page-level backdrops |

---

## 2. Typography & Hierarchy

### A. Page Header
Used at the absolute top of the page.
```tsx
<h1 className="text-2xl font-bold tracking-tight text-[#1e1b4b]">
  Help & Support Center
</h1>
<p className="text-muted-foreground text-sm">
  Get assistance and learn how to use the system effectively
</p>
```
- **Font Size**: `text-2xl` (~24px)
- **Font Weight**: `font-bold` (700)
- **Tracking**: `tracking-tight` (-0.025em)
- **Primary Color**: `text-[#1e1b4b]`

### B. Card Titles & Section Headers
Used inside standard `<CardHeader>` wrappers.
```tsx
<CardTitle className="flex items-center gap-2 text-xl text-[#1e1b4b]">
  <PlayCircle className="h-6 w-6 text-[#1e1b4b]" />
  Getting Started
</CardTitle>
```
- **Font Size**: `text-xl` (~20px)
- **Font Weight**: `font-bold` (700) / `font-semibold` (600)
- **Secondary Title Size (Sidebar)**: `text-lg` (~18px)

### C. In-Card Headings (Level 4)
Used to segment content within card bodies.
```tsx
<h4 className="font-semibold mb-2">System Overview</h4>
```
- **Font Size**: `text-base` (~16px) or defaults to parent inheritance
- **Font Weight**: `font-semibold` (600)
- **Spacing**: `mb-2` (8px bottom margin)

### D. Form Labels
Positioned directly above text fields/inputs.
```tsx
<label className="text-sm font-medium">
  Subject <span className="text-red-500">*</span>
</label>
```
- **Font Size**: `text-sm` (~14px)
- **Font Weight**: `font-medium` (500)

### E. Body & List Text
Used for lists and descriptions.
```tsx
<p className="text-sm text-muted-foreground mb-2">As an officer, you can:</p>
<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
  <li>Review and approve issues...</li>
</ul>
```
- **Font Size**: `text-sm` (~14px)
- **Font Weight**: `font-normal` (400)
- **Color**: `text-muted-foreground`
- **List Spacing**: `space-y-1 ml-2 list-disc list-inside`

### F. Meta/Detail Information (Sub-items)
Used inside Accordion headers or description subtexts.
- **Title**: `font-semibold text-base` (~16px, weight 600)
- **Subtitle/Subtext**: `text-xs text-muted-foreground font-normal` (~12px, weight 400)

---

## 3. Layouts & Spacing

### A. Root Container Spacing
The parent layout uses `space-y-8` (32px vertical gaps) or `space-y-6` (24px vertical gaps) to separate distinct section blocks.
```tsx
<div className="space-y-8">
  {/* Blocks */}
</div>
```

### B. Top Hero Cards Grid
A responsive 4-column layout for high-level options.
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* TopCard items */}
</div>
```

**Card Component Specification (`TopCard`):**
```tsx
<div className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4">
  <div className="p-3 rounded-lg bg-blue-50">
    <Book className="h-6 w-6 text-blue-600" />
  </div>
  <div>
    <div className="font-semibold text-slate-900">User Guide</div>
    <div className="text-sm text-muted-foreground">Complete documentation</div>
  </div>
</div>
```

### C. Two-Column Dashboard/Workspace Layout
Splits the main workspace into a primary content section (2/3 width) and a sidebar section (1/3 width).
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Left Column (2/3 width) */}
  <div className="lg:col-span-2 space-y-8">
    {/* Large Cards / Accordions */}
  </div>

  {/* Right Column (1/3 width) */}
  <div className="space-y-8">
    {/* Form Cards / Utility Sidebars */}
  </div>
</div>
```

---

## 4. Specific UI Component Templates

### A. Information / Alert Banner
A notice box highlighting important messages.
```tsx
<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md flex gap-3">
  <div className="mt-0.5">
    <HelpCircle className="h-5 w-5 text-blue-500" />
  </div>
  <p className="text-sm text-blue-700">
    Your dashboard provides real-time insights into system performance.
  </p>
</div>
```
- **Background**: `bg-blue-50` (or `bg-emerald-50` for success, `bg-rose-50` for danger)
- **Border**: Left-aligned thick accent border `border-l-4 border-blue-500`
- **Text**: Dense state-colored text `text-sm text-blue-700`

### B. Action Buttons
Primary buttons on form columns:
```tsx
<Button className="w-full bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 gap-2 text-white font-medium">
  <Send className="h-4 w-4" />
  Submit Ticket
</Button>
```
- **Theme Color**: `bg-[#1e1b4b]` with state hover `hover:bg-[#1e1b4b]/90`
- **Flex Align**: `gap-2` to separate icons from labels

---

## 5. Summary Cheat-Sheet

| CSS Class | Target | Size / Value |
| :--- | :--- | :--- |
| `text-2xl` | Main Page Titles | 1.5rem (24px) |
| `text-xl` | Primary Section Headings / Card Titles | 1.25rem (20px) |
| `text-lg` | Sidebar / Secondary Card Titles | 1.125rem (18px) |
| `text-base` | Accordion Primary Texts / Subheadings | 1rem (16px) |
| `text-sm` | Default Labels, Body Copy, & Info Text | 0.875rem (14px) |
| `text-xs` | Descriptions, Metadata, Subtitles | 0.75rem (12px) |
| `font-bold` | Header titles | 700 |
| `font-semibold` | Subheadings, Item headers | 600 |
| `font-medium` | Labels, Accordion headings, Button labels | 500 |
| `font-normal` | Paragraphs, lists, standard copies | 400 |
| `gap-4` | Card margins / Icon gaps | 1rem (16px) |
| `gap-8` | Column gaps | 2rem (32px) |
| `space-y-8` | Stack section gaps | 2rem (32px) |
