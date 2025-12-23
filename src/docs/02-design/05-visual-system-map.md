# 🗺️ VISUAL SYSTEM MAP
## Local Scout Trip Operating System - Visual Architecture

**Document:** 05-visual-system-map.md  
**Last Updated:** December 22, 2024  
**Purpose:** Visual representation of all features and workflows

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LOCAL SCOUT TRIP OPERATING SYSTEM                │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
            ┌───────▼────────┐          ┌────────▼─────────┐
            │  PUBLIC SITE   │          │    APP PLATFORM  │
            └───────┬────────┘          └────────┬─────────┘
                    │                            │
        ┌───────────┼───────────┐       ┌────────┼────────┐
        │           │           │       │        │        │
    ┌───▼───┐   ┌──▼──┐   ┌───▼───┐ ┌─▼──┐  ┌──▼──┐  ┌─▼───┐
    │ Home  │   │Price│   │ Use   │ │Trip│  │Exp  │  │Real │
    │       │   │     │   │Cases  │ │Mgmt│  │lore │  │Est  │
    └───────┘   └─────┘   └───────┘ └────┘  └─────┘  └─────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
            ┌───────▼────────┐ ┌──────▼──────┐  ┌────────▼────────┐
            │   6 AI AGENTS  │ │   WIZARDS   │  │   CHATBOTS      │
            │   Event Bus    │ │   Flows     │  │   Interfaces    │
            └────────────────┘ └─────────────┘  └─────────────────┘
```

---

## 🌐 WEBSITE STRUCTURE

### PUBLIC PAGES
- / (Home)
- /how-it-works
- /pricing
- /use-cases/*

### APP PAGES
- /dashboard
- /app/trips
- /app/trip/:id
- /concierge
- /explore
- /saved

### AI SYSTEM
- 6 Specialized Agents
- Event Bus Architecture
- Orchestrator
- Context Manager

---

## 📊 COMPONENT HIERARCHY

```
App.tsx (Root)
├── AppShell (Layout)
│   ├── TopNav
│   ├── Sidebar
│   ├── BottomNav
│   └── Footer
├── Pages (45+)
│   ├── Home
│   ├── Dashboard
│   ├── TripDetailPage
│   ├── ConciergePage
│   └── ...
└── Modals & Overlays
    ├── TripCreateModal
    ├── ConciergeOverlay
    └── AddActivityModal
```

---

## 🎨 VISUAL DESIGN SYSTEM

**Colors:**
- Primary: #064E3B (Emerald 900)
- Accent: #FBBF24 (Amber 400)
- Background: #F7F7F5 (Warm off-white)

**Typography:**
- Serif: Playfair Display (headers)
- Sans: Inter (body)

**Design Philosophy:**
- Luxury, calm, confident
- Editorial aesthetics
- Soft shadows
- Generous whitespace

---

**Document Location:** `/docs/02-design/05-visual-system-map.md`  
**Previous Location:** `/docs/VISUAL-SYSTEM-MAP.md`  
**Full diagrams:** See original file for complete visual maps
