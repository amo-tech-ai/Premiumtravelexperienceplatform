# DESIGN SYSTEM - AI CHATBOT INTERFACE

**Purpose:** Formal documentation of layout, components, and design patterns  
**Status:** Production-Ready  
**Last Updated:** December 24, 2024

---

## LAYOUT ARCHITECTURE

### Overall Structure

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
│  - AI Concierge branding                │
│  - Status indicator                     │
│  - Close button (mobile)                │
├─────────────────────────────────────────┤
│  TAB NAVIGATION                         │
│  - Icon-only tabs                       │
│  - Badge counts                         │
│  - Active state indicator               │
├─────────────────────────────────────────┤
│                                         │
│  RESULTS PANEL (flex-1)                 │
│  - Scrollable content area              │
│  - Tab-specific views                   │
│  - Cards, lists, maps                   │
│                                         │
├─────────────────────────────────────────┤
│  CHAT MESSAGES (max-h-32)               │
│  - Last 3 messages                      │
│  - User & AI bubbles                    │
│  - Loading indicator                    │
├─────────────────────────────────────────┤
│  QUICK ACTIONS                          │
│  - Chip buttons                         │
│  - Pre-defined queries                  │
├─────────────────────────────────────────┤
│  INPUT BAR                              │
│  - Text input (rounded-full)            │
│  - Send button                          │
└─────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Mobile:** 390px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

---

## TAB NAVIGATION SYSTEM

### Tab Configuration

**Component:** `TabNavigation`  
**Location:** `/components/chatbot/TabNavigation.tsx`

**Tab Structure:**
```typescript
interface TabConfig {
  id: TabId; // 'trips' | 'events' | 'restaurants' | 'rentals' | 'map'
  label: string;
  icon: LucideIcon;
  badge: number; // Count of items in tab
}
```

**Tabs (Left to Right):**

1. **Trips** 🧳
   - Icon: `Luggage`
   - Shows planned itineraries
   - Badge: Number of active trips

2. **Events** 🎫
   - Icon: `Ticket`
   - Shows nearby activities
   - Badge: Number of available events

3. **Restaurants** 🍴
   - Icon: `UtensilsCrossed`
   - Shows dining recommendations
   - Badge: Number of matched restaurants

4. **Rentals** 🏠
   - Icon: `Home`
   - Shows properties/stays
   - Badge: Number of saved rentals

5. **Map** 🗺️
   - Icon: `MapIcon`
   - Shows all results on map
   - Badge: Total pinned locations

### Visual States

**Default State:**
- Text: `text-slate-500`
- Background: `transparent`
- Icon: Regular size (w-5 h-5)

**Hover State:**
- Text: `text-slate-700`
- Background: `bg-slate-50`
- Transition: `transition-all`

**Active State:**
- Text: `text-emerald-600`
- Background: `transparent`
- Icon: Same size, emerald color
- Bottom border or highlight

**Badge Display:**
- Position: Absolute, top-right of icon
- Size: Min 18px × 18px
- Background: `bg-emerald-600` (active) or `bg-slate-600` (inactive)
- Text: `text-white`, 10px font, bold
- Shows "99+" if count exceeds 99

---

## COLOR SYSTEM

### Brand Colors

**Primary (Emerald):**
- `emerald-50`: Background highlights
- `emerald-600`: Primary actions, active states
- `emerald-700`: Hover states

**Accent Colors:**
- **Restaurants:** `orange-500` / `orange-600`
- **Events:** `purple-500` / `purple-600`
- **Rentals:** `blue-500` / `blue-600`
- **Success:** `emerald-600`
- **Warning:** `amber-500`
- **Error:** `red-600`

### Neutral Colors

- `slate-50`: Light backgrounds
- `slate-100`: Secondary backgrounds
- `slate-200`: Borders
- `slate-500`: Secondary text
- `slate-600`: Labels
- `slate-700`: Body text
- `slate-900`: Headlines

---

## TYPOGRAPHY

### Font Hierarchy

**Headlines:**
- Font weight: `font-semibold` (600)
- No explicit text size classes (uses globals.css defaults)

**Body Text:**
- Font weight: `font-normal` (400)
- Line height: `leading-relaxed`

**Small Text:**
- Size: `text-xs` (12px)
- Weight: `font-normal`

**Labels:**
- Size: `text-[11px]` or `text-[10px]`
- Weight: `font-medium`

**Rule:** Never use `text-2xl`, `font-bold`, or `leading-none` unless explicitly requested.

---

## COMPONENT PATTERNS

### Card System

**Base Card:**
```tsx
<div className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm">
  {/* Content */}
</div>
```

**Interactive Card (Selectable):**
```tsx
<div className={cn(
  "bg-white rounded-xl p-4 border transition-all cursor-pointer",
  isSelected 
    ? "border-emerald-500 shadow-md ring-2 ring-emerald-100"
    : "border-slate-200 hover:border-emerald-300"
)}>
  {/* Content */}
</div>
```

**Card with State Indicators:**
- Saved: `ring-1 ring-amber-200`
- Added to Trip: `bg-emerald-50/30`
- Recently Added: Purple badge with sparkle icon

---

## INTERACTION PATTERNS

### Hover States

**Cards:**
- Border color changes: `border-slate-200` → `border-emerald-300`
- Shadow appears: `shadow-sm`
- Quick actions fade in: `opacity-0` → `opacity-100`

**Buttons:**
- Background darkens: `bg-emerald-600` → `bg-emerald-700`
- Icon buttons: `hover:bg-slate-100`

### Selected States

**Cards:**
- Border: `border-emerald-500`
- Shadow: `shadow-md`
- Ring: `ring-2 ring-emerald-100`

**Tabs:**
- Text color: `text-emerald-600`
- Badge: `bg-emerald-600`

### Loading States

**Skeleton Screens:**
- Background: `bg-slate-100`
- Animated pulse: `animate-pulse`

**Spinner:**
- Icon: `Loader2` with `animate-spin`
- Size: `w-4 h-4` or `w-3 h-3`
- Color: `text-slate-500`

---

## SPACING SYSTEM

### Container Padding

- Tab panels: `p-4`
- Cards: `p-3` or `p-4`
- Tight sections: `p-2.5`

### Gaps

- Card lists: `space-y-2` or `space-y-3`
- Horizontal elements: `gap-2` or `gap-3`
- Icon + text: `gap-1.5` or `gap-2`

### Heights

- Input bar: `py-3 px-4`
- Button small: `h-7`
- Button default: `h-9`
- Chat area: `max-h-32`

---

## ANIMATION GUIDELINES

### Motion Principles

**Restraint:** Use animation sparingly for purposeful feedback  
**Speed:** Fast transitions (150-300ms)  
**Easing:** Natural curves (`ease-in-out`)

### Common Animations

**Fade In:**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
```

**Scale In:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
>
```

**Slide Up (Mobile Bottom Sheet):**
```tsx
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>
```

---

## ACCESSIBILITY

### Focus States

All interactive elements have visible focus rings:
```css
focus:outline-none focus:ring-2 focus:ring-emerald-500
```

### Keyboard Navigation

- Tab navigation: Arrow keys or Tab
- Enter: Select/activate
- Escape: Close modals/overlays

### Screen Readers

- Semantic HTML elements
- ARIA labels for icon-only buttons
- Alt text for images (when added)

---

## DOCUMENT STATUS

✅ **Complete**  
**Next:** Component library documentation
