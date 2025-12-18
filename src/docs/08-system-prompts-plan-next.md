# 🎨 Figma Improvement Plan: System Prompts Next

> **Status**: ⚪ Pending Start  
> **Goal**: Production Safety & Trust  
> **Aesthetic**: Luxury Eco-Modern (Refinement Phase)  
> **Focus**: Trust visuals, Empty states, Data stress, Content guardrails  

## 📊 Progress Tracker

- [x] **Step 1**: AI Trust & Uncertainty Visuals
- [x] **Step 2**: Intelligent Empty States
- [x] **Step 3**: Data Stress & Missing Data States
- [x] **Step 4**: Content Guardrails (Design Tokens)
- [x] **Step 5**: Save, Remove, Unavailable States
- [x] **Step 6**: Final Micro-Interaction Polish

---

## Short Summary

Your product is visually strong. Figma does not need redesign — it needs completion:

- Trust & uncertainty visuals
- Smarter empty states
- Data-stress visuals
- Content guardrails
- Final UX polish for real-world messiness

These steps bring Figma from "beautiful" → "production-safe."

---

## 🟢 Step 1 — Add AI Trust & Uncertainty Visual States (MOST IMPORTANT)

**Why**: Luxury products are calm and honest. Right now, Figma only shows confidence, not uncertainty.

### 📝 Figma Prompt 1 — AI Confidence States
> "Create visual UI states for AI responses with different confidence levels.
>
> Design 3 subtle variants:
> 1) **High confidence** (default)
> 2) **Partial confidence**
> 3) **Low confidence / unverified**
>
> **Rules**:
> - No warning icons
> - No red colors
> - Neutral, editorial tone
> - Feels informative, not alarming
>
> **Include**:
> - Small inline note below AI message
> - Soft background (light gray / glass)
> - Minimal icon (dot or info circle)
>
> **Example copy**:
> • 'Based on available sources'
> • 'Some details may vary'
> • 'Couldn’t fully verify this information'
>
> Show this inside the chat UI and results drawer."

### ✅ Output Needed
- [ ] 3 visual variants
- [ ] Desktop + mobile versions

---

## 🟢 Step 2 — Upgrade Empty States (From Static → Intelligent)

**Why**: Empty states are currently correct, but not helpful.

### 📝 Figma Prompt 2 — Contextual Empty States
> "Design intelligent empty-state screens for Events, Real Estate, and Itineraries.
>
> Instead of generic messages, include:
> - A reason (time, location, filters)
> - 1–2 suggested next actions
> - Soft, optimistic tone
>
> **Examples**:
> • 'No jazz events tonight in Laureles'
>   → Try El Poblado
>   → Try tomorrow
>
> • 'No properties match this budget'
>   → Increase budget
>   → Change neighborhood
>
> **Design**:
> - Icon or illustration (very subtle)
> - Primary CTA (filled)
> - Secondary CTA (text or ghost)"

### ✅ Output Needed
- [ ] Events empty state
- [ ] Real estate empty state
- [ ] Itinerary empty state

---

## 🟢 Step 3 — Data Stress & Missing Data Visuals

**Why**: Real data is messy. Figma must show how UI behaves when data is missing.

### 📝 Figma Prompt 3 — Missing Data States
> "Design UI behavior for cards and detail pages when data is missing.
>
> **Cases to cover**:
> - Missing image
> - Very long title
> - Missing ROI or price
> - Missing booking link
>
> **Rules**:
> - Never break layout
> - Never show raw placeholders like 'N/A'
> - Use friendly microcopy
>
> **Examples**:
> • 'Price available on request'
> • 'Image coming soon'
> • 'Booking opens later'
>
> Show:
> - Card grid examples
> - Detail page examples"

### ✅ Output Needed
- [ ] Card with missing image
- [ ] Card with long title
- [ ] Card without price/ROI

---

## 🟢 Step 4 — Define Content Guardrails (Design Tokens)

**Why**: Cursor needs clear visual limits, not guesses.

### 📝 Figma Prompt 4 — Content Rules Frame
> "Create a design-spec frame that defines content limits.
>
> **Include**:
> - Max title length (1–2 lines)
> - Max subtitle length
> - Badge character limits
> - Description truncation rules
>
> **Show**:
> - Correct example
> - Broken example
> - How UI handles overflow (ellipsis, fade)
>
> This is a reference frame, not a screen."

### ✅ Output Needed
- [ ] One "Content Rules" page in Figma

---

## 🟢 Step 5 — Save, Remove, Unavailable Visual States

**Why**: Users save things. Things disappear. Figma must show graceful failure, not silence.

### 📝 Figma Prompt 5 — Save & Unavailable States
> "Design visual states for saved items and itinerary items when content changes.
>
> **Scenarios**:
> - Saved item removed
> - Event cancelled
> - Property unavailable
> - Booking closed
>
> **Design**:
> - Card stays visible but muted
> - Label: 'No longer available'
> - Soft CTA: 'Remove' or 'Find alternatives'
>
> No alerts. No popups."

### ✅ Output Needed
- [ ] Saved list example
- [ ] Itinerary item example

---

## 🟢 Step 6 — Final Micro-Interaction Polish (Visual Only)

**Why**: This locks the "luxury" feel.

### 📝 Figma Prompt 6 — Micro-Interactions Spec
> "Define micro-interaction guidelines for all interactive elements.
>
> **Include**:
> - Hover lift distance
> - Shadow depth on hover
> - Press/tap scale
> - Transition duration (slow, calm)
>
> **Show examples for**:
> - Cards
> - Buttons
> - Tabs
> - Drawer handles
>
> No code. Visual reference only."

### ✅ Output Needed
- [ ] One micro-interaction reference frame

---

## 🚫 What Figma Does NOT Need to Change

**Do NOT redesign**:
- Layouts
- Navigation
- Card structure
- Chat UI
- Color palette
- Typography

Those are locked.

---

## 📊 Figma Completion Checklist

| Area | Status After These Steps |
| :--- | :--- |
| Visual system | ✅ Complete |
| Trust states | ✅ Complete |
| Empty states | ✅ Complete |
| Data stress | ✅ Complete |
| Content rules | ✅ Complete |
| Production safety | ✅ Complete |

After this → Cursor builds with zero ambiguity.

## 🧠 Final Takeaway

Right now: **Your design is beautiful**

After these steps: **Your design becomes bulletproof**

This is the difference between:
*"Looks great"* and *"Safe to launch"*
