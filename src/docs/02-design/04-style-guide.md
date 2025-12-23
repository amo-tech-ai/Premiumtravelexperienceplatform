# Design System Style Guide
## Local Scout - Luxury Travel Platform

**Document:** 04-style-guide.md  
**Version:** 1.0  
**Last Updated:** December 22, 2024  
**Status:** 🔒 Design Locked

---

## Overview

Premium travel platform with editorial aesthetics, inspired by luxury travel publications. Design prioritizes **calm intelligence**, **sophisticated minimalism**, and **trust**.

**Core Principles:**
- Luxury without clutter
- Intelligence without intimidation
- Data without overwhelm

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#064E3B` | Emerald 900 - Primary actions, headers |
| `--accent` | `#FBBF24` | Amber 400 - Highlights, CTAs |
| `--background` | `#F7F7F5` | Warm off-white background |
| `--cream` | `#FDFBF7` | Itinerary feed background |
| `--card` | `#FFFFFF` | White cards |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--secondary` | `#F0FDF4` | Emerald 50 - Subtle highlights |
| `--muted` | `#ECECF0` | Disabled states, borders |
| `--destructive` | `#D4183D` | Errors, deletions |

### Usage Rules

✅ **Do:**
- Use `primary` for main navigation, key CTAs
- Use `accent` sparingly (10% of UI max)
- Maintain 4.5:1 contrast ratio minimum

❌ **Don't:**
- Mix primary + accent in same button
- Use pure black (#000) - use foreground token

---

## Typography

**Serif:** Playfair Display (headers, emphasis)  
**Sans:** Inter (body, UI)

### Type Scale

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Playfair | 48px | 600 |
| H2 | Playfair | 36px | 600 |
| H3 | Playfair | 24px | 500 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Caption | Inter | 12px | 400 |

---

## Spacing

**Base unit:** 4px

```
xs: 4px   (1 unit)
sm: 8px   (2 units)
md: 16px  (4 units)
lg: 24px  (6 units)
xl: 32px  (8 units)
2xl: 48px (12 units)
```

---

## Components

### Buttons
- Primary: Filled with primary color
- Secondary: Outlined with border
- Ghost: Text only with hover state

### Cards
- Background: White
- Border: 1px solid muted
- Shadow: Soft (0 2px 8px rgba(0,0,0,0.08))
- Radius: 12px

### Inputs
- Height: 40px
- Padding: 12px 16px
- Border: 1px solid muted
- Focus: 2px ring primary

---

**Document Location:** `/docs/02-design/04-style-guide.md`  
**Previous Location:** `/docs/style-guide.md`  
**Full content:** See original file for complete specifications
