# 🤝 The Final Handoff Contract
> **Strict Rules for "Luxury AI Concierge" Project**
> **Design (Figma)** defines SHAPE. **Engineering (Cursor)** defines MEANING.

---

## 1. The Golden Rule
**Figma** creates generic, reusable visual containers ("Slots").
**Cursor** pours specific data (Events, Properties, Trips) into those slots.

| ❌ Figma Must NOT Do | ✅ Figma MUST Do |
| :--- | :--- |
| Name components `EventCard` or `PropertyCard` | Name component `LuxuryCard` (Variant: `Image-Heavy`) |
| Label text layers `Price` or `Date` | Label text layers `Slot / Meta-Primary` |
| Design logic (e.g., "Show this if...") | Design states (Visible / Hidden / Empty) |
| Define data formats ("$1,200.00") | Define text styles ("Heading / Serif / Large") |

---

## 2. Figma Layer Naming Convention
Use this convention to ensure code generation maps correctly to visual slots.

**Syntax**: `Context / Function / State`

### 🏗️ Base Structures
*   `Shell / Desktop / Nav`
*   `Shell / Mobile / TabBar`
*   `Layout / Grid-3-Col`
*   `Drawer / Base`

### 🃏 Card Components (`LuxuryCard`)
*   `Card / Container` (The main wrapper)
*   `Image / Aspect-4-3` (The image container)
*   `Badge / Slot-Top-Right` (Where "New", "Verified", or "Sold" goes)
*   `Text / Heading` (The main title slot)
*   `Row / Meta-Primary` (Left: Location / Right: Price)
*   `Row / Meta-Secondary` (Details like beds/baths or time)
*   `Action / Button-Icon` (Heart, Share, or Arrow)

### 🧩 Drawer & Lists
*   `List / Item-Row`
*   `Drawer / Handle`
*   `State / Loading-Skeleton`
*   `State / Empty-Placeholder`

---

## 3. Visual System States (Figma Page)
The designer must provide a dedicated page named **"System States"** containing ONLY these visual representations:
1.  **Loading**: Shimmer skeletons for Cards and Lists.
2.  **Empty**: "No content" view with a clear generic CTA button.
3.  **Error**: "Something went wrong" view with `Retry` icon.
4.  **Auth**: Glassmorphism overlay for "Sign In Required".
5.  **Offline**: Subtle banner or toast notification style.

---

## 4. Cursor "Do Not Redesign" Guard Prompt
**Copy and paste this into Cursor at the start of every session:**

```text
🛑 SYSTEM INSTRUCTION: ENGINEER ROLE ONLY 🛑

You are the Lead Frontend Engineer. Your role is strictly IMPLEMENTATION and WIRING.

YOUR RULES:
1.  🚫 DO NOT DESIGN. Do not invent new UI, change colors, adjust margins, or pick fonts. Use the provided Tailwind classes and design tokens exactly as defined.
2.  🚫 DO NOT GUESS DATA SHAPES. Visual slots in Figma (e.g., "Meta-Primary") must be mapped to specific data fields (e.g., `property.price` or `event.date`) based on the context.
3.  ✅ OBEY THE SLOT SYSTEM. 
    - If Figma shows a "Badge Slot", you must implement logic to decide WHAT text goes there (e.g., `isNew ? "New" : null`).
    - You do not decide WHERE it goes.
4.  ✅ HANDLE OVERFLOW. If real data is longer than the visual design allows, implement truncation (`truncate`), not layout changes.
5.  ✅ IMPLEMENT STATES. Always implement the Loading, Empty, and Error states defined in the design system, even if I don't ask for them explicitly.

If a visual design is missing for a specific logic requirement, STOP and ask for a visual definition. Do not improvise a UI.
```
