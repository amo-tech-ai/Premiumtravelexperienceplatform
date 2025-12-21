# Animation Index & Quick Reference

**Last Updated:** December 20, 2024

---

## 📋 MASTER ANIMATION TABLE

| Animation Type | Duration | Easing | Trigger | Use Case | File Reference |
|---------------|----------|--------|---------|----------|----------------|
| **MICRO-INTERACTIONS** |
| Hover Lift | 150-250ms | ease-out | Mouse enter | Buttons, cards | Core |
| Click Press | 100-200ms | ease-in-out | Mouse down/up | All interactive | Core |
| Focus Ring | 150ms | ease-out | Tab/keyboard | Accessibility | Core |
| Ripple Effect | 600ms | ease-out | Click | Material design | Advanced |
| **ENTRANCES** |
| Fade In | 300-600ms | ease-out | Page load, scroll | Content reveal | Core |
| Slide In | 400-600ms | ease-out | Page load, scroll | Panels, modals | Core |
| Scale In | 300-500ms | ease-out | Page load | Icons, cards | Core |
| Stagger In | 100-150ms delay | ease-out | Scroll into view | Card grids, lists | Core |
| **SCROLL EFFECTS** |
| Parallax | Scroll-based | linear | Scroll | Backgrounds | Advanced |
| Scroll Reveal | 400-600ms | ease-out | IntersectionObserver | Sections | Core |
| Sticky Header | 200ms | ease-out | Scroll threshold | Navigation | Advanced |
| Progress Indicator | Scroll-based | linear | Scroll progress | Reading progress | Advanced |
| **TRANSITIONS** |
| Page Transition | 400-500ms | ease-in-out | Route change | SPA navigation | Advanced |
| Modal Open/Close | 300-400ms | ease-out | Click | Dialogs, overlays | Core |
| Tab Switch | 250-300ms | ease-in-out | Click | Tab navigation | Core |
| Accordion | 300-400ms | ease-out | Click | Expand/collapse | Advanced |
| Carousel | 500-600ms | ease-in-out | Click, auto | Image sliders | Advanced |
| **FEEDBACK** |
| Loading Spinner | 1000ms loop | linear | Async start | Data loading | Core |
| Progress Bar | Task duration | ease-out | Process start | File upload, etc | Core |
| Skeleton Screen | 1500ms pulse | ease-in-out | Loading | Content placeholder | Advanced |
| Toast Notification | 400ms in/out | ease-out | Event trigger | User feedback | Advanced |
| **STATES** |
| Form Validation | 200-300ms | ease-out | Blur, submit | Input errors | Core |
| Success Checkmark | 400ms | spring | Success event | Confirmations | Core |
| Error Shake | 400ms | ease-out | Error event | Invalid input | Core |
| Toggle Switch | 200-250ms | ease-out | Click | On/off states | Core |
| **ADVANCED** |
| Number Counter | 1500-2500ms | ease-out | Scroll in view | Stats display | Advanced |
| Typewriter | 50-80ms/char | linear | Trigger | Hero text | Advanced |
| Morph/Shape | 400-600ms | ease-in-out | State change | Icon transforms | Advanced |
| Cursor Follow | Real-time | ease-out | Mouse move | Interactive demos | Advanced |
| Confetti | 2000-3000ms | ease-out | Success event | Celebrations | Advanced |

---

## 🎯 WHEN TO USE WHICH ANIMATION

### By User Goal

```
USER WANTS TO:
├─ Understand interactivity → Hover, Focus (150-250ms)
├─ Navigate → Page transitions, Tab switch (300-500ms)
├─ See status → Loading, Progress (1000ms+)
├─ Discover content → Scroll reveal, Stagger (400-600ms)
├─ Receive feedback → Toast, Checkmark (300-400ms)
└─ Engage deeply → Parallax, Counter, Typewriter (1500ms+)
```

### By Context

**Homepage/Landing:**
- Hero entrance (Fade + Slide)
- Scroll reveal (Stagger)
- Parallax backgrounds
- CTA hover effects

**Dashboard:**
- Number counters
- Progress bars
- Card hover lifts
- Chart animations

**Forms:**
- Input focus rings
- Validation states (shake, checkmark)
- Submit button (loading)
- Success toast

**Navigation:**
- Tab indicators
- Accordion expand
- Modal open/close
- Sticky header

**E-commerce:**
- Product card hover
- Add to cart (loading → success)
- Image carousels
- Wishlist heart animation

---

## 📚 FILE REFERENCES

### Core Animations (`/docs/rules/animations-core.md`)
**Use for:** 90% of UI needs, production-ready patterns
- All micro-interactions
- Basic entrances/exits
- Common transitions
- Form feedback
- Loading states

### Advanced Animations (`/docs/rules/animations-advanced.md`)
**Use for:** Premium experiences, complex interactions
- Parallax effects
- Multi-step sequences
- Custom morphing
- Performance-critical animations
- Accessibility patterns

### Design Prompt System (`/docs/rules/design-prompt-system.md`)
**Use for:** Planning animations before coding
- Animation timelines
- Mermaid diagrams
- User journey mapping
- Figma AI prompts

---

## ⚡ QUICK DECISION TREE

```
Need animation?
│
├─ User hovering? → Hover Lift (200ms)
├─ User clicking? → Press Down/Up (100-200ms)
├─ Page loading? → Fade/Slide In (400-600ms)
├─ Content scrolling in? → Scroll Reveal + Stagger (400ms + 100ms delay)
├─ Form validating? → Shake (error) or Checkmark (success) (300-400ms)
├─ Data loading? → Spinner (1000ms loop)
├─ Modal opening? → Backdrop + Scale In (300-400ms)
├─ Tab switching? → Slide/Fade crossfade (250-300ms)
└─ Special effect? → See Advanced file
```

---

## 🎨 PROPERTY CHEAT SHEET

### Safe to Animate (60fps)
- `opacity`
- `transform` (translate, scale, rotate)

### Avoid Animating (causes reflow)
- `width`, `height`
- `margin`, `padding`
- `top`, `left`, `right`, `bottom` (use `transform` instead)
- `border-width`

### Motion Values

```typescript
// Good
<motion.div
  style={{ x: 100, y: 50 }}  // Transform
  animate={{ opacity: 1 }}
/>

// Bad (causes layout thrash)
<motion.div
  animate={{ width: '300px', marginTop: '20px' }}
/>
```

---

## 📊 TIMING REFERENCE

```
INSTANT          0ms      ← State changes (toggle, etc)
VERY FAST     50-150ms    ← Micro-interactions (hover, focus)
FAST         150-250ms    ← Button clicks, small UI changes
MODERATE     250-400ms    ← Modals, tabs, most transitions
SLOW         400-600ms    ← Page sections, large movements
VERY SLOW   600-1000ms    ← Emphasis, storytelling
LOOPING    1000-2000ms    ← Spinners, pulsing
```

---

## ♿ ACCESSIBILITY CHECKLIST

```
BEFORE SHIPPING ANY ANIMATION:
[ ] Respects prefers-reduced-motion
[ ] Focus states clearly visible
[ ] No motion-induced seizures (no rapid flashing)
[ ] Animation doesn't block interaction
[ ] Content readable during animation
[ ] Screen reader announces state changes
[ ] Keyboard users have alternative
[ ] Animation has purpose (not decorative only)
```

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Essential (Ship MVP)
```
[ ] Hover states (buttons, links)
[ ] Click feedback (buttons)
[ ] Focus indicators (keyboard)
[ ] Loading spinners
[ ] Form validation states
```

### Phase 2: Polish (V1.1)
```
[ ] Scroll reveals
[ ] Fade entrances
[ ] Modal transitions
[ ] Tab switching
[ ] Staggered lists
```

### Phase 3: Premium (V2.0)
```
[ ] Parallax effects
[ ] Number counters
[ ] Advanced sequences
[ ] Celebration animations
[ ] Custom morphing
```

---

## 🔍 TROUBLESHOOTING

| Problem | Check | Fix |
|---------|-------|-----|
| Animation janky | Animating width/height? | Use `transform` instead |
| Doesn't trigger | IntersectionObserver set up? | Check threshold, margin |
| Too slow on mobile | Duration too long? | Reduce by 30% on mobile |
| Conflicts with other animation | Multiple state changes? | Coordinate with AnimatePresence |
| Not smooth | Too many simultaneous? | Stagger or reduce complexity |
| Accessibility error | Missing reduced motion? | Add media query check |

---

## 📖 RELATED DOCUMENTATION

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `/docs/rules/quality-standards.md` | Pre-ship checklist | Before marking done |
| `/docs/rules/forensic-audit.md` | Production verification | Before deployment |
| `/docs/rules/design-prompt-system.md` | Design specifications | Planning phase |
| `/docs/rules/animations-core.md` | Basic animations | Daily development |
| `/docs/rules/animations-advanced.md` | Complex animations | Premium features |
| `/docs/rules/response-format.md` | Communication rules | Every response |

---

## 💡 GOLDEN RULES

1. **Animate only `opacity` and `transform`** (60fps guarantee)
2. **Duration: 200-600ms** for most UI (longer feels slow)
3. **Easing: ease-out** for majority of cases
4. **Respect `prefers-reduced-motion`** (accessibility law)
5. **Purpose over decoration** (every animation should serve UX)
6. **Test on real devices** (desktop smooth ≠ mobile smooth)
7. **Stagger, don't overwhelm** (max 10 items at once)
8. **Loading states always** (users need feedback)

---

**Quick Links:**
- [Core Animations →](/docs/rules/animations-core.md)
- [Advanced Animations →](/docs/rules/animations-advanced.md)
- [Design Prompt System →](/docs/rules/design-prompt-system.md)
