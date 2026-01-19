# HOW IT WORKS — QUICK REFERENCE GUIDE
## Developer & Designer Quick Start

---

## 🚀 QUICK START

### To Use This Component:

```tsx
import { HowItWorksScrollSection } from '../components/HowItWorksScrollSection';

// In your page component:
<HowItWorksScrollSection />
```

**That's it!** The component handles all responsive behavior automatically.

---

## 📁 FILE STRUCTURE

```
/components/
  ├── HowItWorksScrollSection.tsx   # Main orchestrator
  ├── HowItWorksMobile.tsx           # Mobile layout (≤767px)
  └── HowItWorksTablet.tsx           # Tablet layout (768-1023px)

/utils/
  └── motionPreferences.ts           # Accessibility utilities

/pages/
  └── HomeV3.tsx                     # Integration point

/docs/00-ilm/
  ├── 03-howitworks-planning.md      # Design specs
  ├── 04-howitworks-implementation-plan.md
  ├── 05-howitworks-completion-summary.md
  └── 06-howitworks-quick-reference.md  # This file
```

---

## 📐 BREAKPOINTS

| Device | Breakpoint | Layout | Scroll Behavior |
|--------|-----------|--------|-----------------|
| Mobile | ≤767px | Stacked vertical | Static screenshots |
| Tablet | 768-1023px | Side-by-side | Fade on scroll |
| Desktop | ≥1024px | Two-column sticky | Scroll-driven 400vh |

### Tailwind Classes Used:
- `md:hidden` - Hide on tablet/desktop
- `hidden md:block lg:hidden` - Show only on tablet
- `hidden lg:block` - Show only on desktop

---

## 🎨 DESIGN TOKENS

### Colors
```css
--emerald-600: #059669  /* Primary actions, active states */
--emerald-100: #d1fae5  /* Soft backgrounds */
--amber-500: #f59e0b    /* Accents, CTAs */
--amber-100: #fef3c7    /* Highlight backgrounds */
--slate-900: #0f172a    /* Headlines */
--slate-600: #475569    /* Body text */
--slate-50: #f8fafc     /* Section backgrounds */
```

### Spacing
```css
/* Padding */
p-10: 40px  /* Desktop dashboard content */
p-8: 32px   /* Tablet dashboard content */
p-6: 24px   /* Mobile dashboard content */

/* Gaps */
gap-12: 48px  /* Desktop columns */
gap-8: 32px   /* Tablet columns */
gap-4: 16px   /* Card spacing */
```

### Border Radius
```css
rounded-xl: 12px  /* Cards, buttons */
rounded-2xl: 16px /* Dashboard window */
rounded-lg: 8px   /* Inputs, small elements */
```

---

## 🔧 CUSTOMIZATION GUIDE

### To Change Step Content:

**Desktop:** Edit `/components/HowItWorksScrollSection.tsx`
```tsx
// Find the motion.div for the step you want to change
<motion.div animate={{ opacity: activeStep === 0 ? 1 : 0 }}>
  {/* Update content here */}
</motion.div>
```

**Mobile:** Edit `/components/HowItWorksMobile.tsx`
**Tablet:** Edit `/components/HowItWorksTablet.tsx`

### To Change Scroll Height:

```tsx
// In HowItWorksScrollSection.tsx, line ~105
style={{ height: '400vh' }}  // Change this value
```

**Note:** If you change this, update scroll logic:
```tsx
const step = Math.floor(progress * 4);  // 4 = number of steps
```

### To Add a 5th Step:

1. Update scroll logic: `progress * 5`
2. Add new step indicator in left column
3. Add new screen in right column
4. Update all 3 responsive variants
5. Change height to `500vh`

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Scroll detection not working
**Fix:** Check that `scrollContainerRef` is attached to the 400vh container

### Issue: Screens not crossfading smoothly
**Fix:** Verify `activeStep` state is updating correctly in console

### Issue: Mobile layout showing on desktop
**Fix:** Check Tailwind breakpoint classes (`md:hidden`, `lg:block`)

### Issue: Content overflowing on mobile
**Fix:** Reduce padding or card count in mobile component

### Issue: Animations choppy
**Fix:** User may have `prefers-reduced-motion` enabled (this is correct behavior)

---

## 📊 ANALYTICS TRACKING (Recommended)

### Events to Track:

```tsx
// When user scrolls to section
trackEvent('how_it_works_viewed');

// When user scrolls through each step
trackEvent('how_it_works_step_viewed', { step: activeStep });

// When user reaches bottom
trackEvent('how_it_works_completed');
```

### Metrics to Monitor:

- **Scroll completion rate:** % of users who scroll through all 4 steps
- **Time on section:** Average time users spend in this section
- **Bounce rate:** % of users who leave after viewing
- **Device breakdown:** Desktop vs mobile vs tablet engagement

---

## 🎯 PERFORMANCE TARGETS

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | TBD |
| Scroll FPS | ≥ 60 | TBD |
| Animation Jank | < 5% | TBD |
| Lighthouse Accessibility | ≥ 95 | TBD |

**Test with:** Chrome DevTools Performance tab

---

## ♿ ACCESSIBILITY CHECKLIST

- [x] Semantic HTML5 structure
- [x] ARIA labels not needed (semantic HTML sufficient)
- [x] Keyboard navigable
- [x] Screen reader compatible
- [x] High contrast ratios (WCAG AA)
- [x] Touch targets ≥ 44px (mobile)
- [x] prefers-reduced-motion respected
- [x] No flashing or strobing content

---

## 🔄 UPDATE WORKFLOW

### To Update Step Content:

1. **Edit content** in appropriate component file
2. **Test on all viewports** (mobile, tablet, desktop)
3. **Verify no overflow** (especially mobile)
4. **Check motion preferences** (toggle in DevTools)
5. **Commit changes** with descriptive message

### To Add New Features:

1. **Check planning doc** (`03-howitworks-planning.md`)
2. **Follow modular pattern** (create new component if needed)
3. **Update all 3 responsive variants** (desktop, tablet, mobile)
4. **Test accessibility** (keyboard, screen reader)
5. **Document in this guide**

---

## 📞 SUPPORT & QUESTIONS

### For Design Questions:
- See: `03-howitworks-planning.md`
- Check: Figma design system (if available)
- Ask: Product Designer

### For Implementation Questions:
- See: `04-howitworks-implementation-plan.md`
- Check: Component code comments
- Ask: Lead Developer

### For Performance Issues:
- See: `05-howitworks-completion-summary.md` (Performance section)
- Use: Chrome DevTools Performance profiler
- Consider: Phase 8 optimizations

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before deploying changes:

- [ ] Tested on mobile (375px, 414px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1024px, 1440px)
- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] No horizontal scroll on any viewport
- [ ] Reduced motion preference works
- [ ] All text is readable
- [ ] Touch targets are adequate (mobile)
- [ ] Screenshots load correctly
- [ ] Animations are smooth (60fps)

---

## 🚢 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-19 | Initial production release |
| | | - Desktop scroll-driven experience |
| | | - Mobile/tablet responsive layouts |
| | | - Accessibility support |
| | | - 4 complete steps implemented |

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2026-01-19  
**Maintained By:** Development Team
