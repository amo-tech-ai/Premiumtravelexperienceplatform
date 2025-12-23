# FIGMA PAGE STRUCTURE
## Page-Level Architecture & Organization

**Document:** 12-figma-page-structure.md  
**Last Updated:** December 22, 2024  
**Purpose:** Define page hierarchy and navigation structure

---

## 📄 PAGE HIERARCHY

### Level 1: Public Pages
```
/
├── Home (/)
├── How It Works (/how-it-works)
├── Pricing (/pricing)
└── Use Cases (/use-cases)
    ├── Digital Nomad
    ├── Luxury Traveler
    └── Group Trip
```

### Level 2: App Pages
```
/app
├── Dashboard (/dashboard)
├── Trips (/app/trips)
├── Trip Detail (/app/trip/:id)
├── Concierge (/app/concierge)
├── Explorer (/explore)
├── Saved Places (/saved)
└── Collections (/collections)
```

### Level 3: Feature Pages
```
/features
├── Real Estate (/real-estate)
│   ├── Search
│   ├── Property Detail
│   └── Market Data
└── Experiences (/experiences)
    ├── Medellin
    └── Experience Detail
```

---

## 🧭 NAVIGATION STRUCTURE

### Top Navigation (Desktop)
- Logo (left)
- Primary links (center)
- User menu (right)
- Search (right)

### Bottom Navigation (Mobile)
- Home
- Explore
- Trips
- Saved
- Profile

### Sidebar (App)
- Dashboard
- My Trips
- Collections
- Settings

---

## 📐 LAYOUT TEMPLATES

### Template A: Marketing Page
- Header with navigation
- Hero section
- Features grid
- CTA section
- Footer

### Template B: App Page
- Top nav
- Sidebar (desktop)
- Main content area
- Right sidebar (optional)
- Bottom nav (mobile)

### Template C: Detail Page
- Breadcrumbs
- Hero/header
- Content sections
- Sidebar info
- Related content

---

## 🎨 COMMON SECTIONS

### Hero Section
- Full-width background
- Large headline (48-72px)
- Subheadline (18-24px)
- Primary CTA
- Secondary CTA
- Hero image/video

### Feature Grid
- 3-4 columns (desktop)
- 2 columns (tablet)
- 1 column (mobile)
- Icon + title + description
- Optional CTA

### Content Section
- Max-width: 1200px
- Padding: 64px vertical
- 2-column layout
- Image + text

---

**Document Location:** `/docs/figma-prompts/12-figma-page-structure.md`  
**Previous Location:** `/docs/10-figma-page-structure.md`  
**Full structure:** See original file for complete page layouts
