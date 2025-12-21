# Quality Standards & Rules

**Last Updated:** December 20, 2024

---

## 🚫 DON'T

- ❌ Create summary documents
- ❌ Repeat information multiple times
- ❌ Write long explanatory responses
- ❌ Create README files unless explicitly requested
- ❌ Over-document completed work

---

## ✅ DO

- ✅ Say it once, clearly
- ✅ Use checklists to track progress
- ✅ Verify code before shipping
- ✅ Follow existing patterns
- ✅ Check for errors systematically

---

## 📋 Pre-Flight Checklist (Use Before Every Response)

```
[ ] Read existing code first
[ ] Check for similar patterns in codebase
[ ] Verify imports exist
[ ] Test logic mentally before coding
[ ] Use existing components (don't recreate)
[ ] Check responsive design
[ ] Verify accessibility
[ ] No duplicate functionality
```

---

## 🔍 Verification System

### Before Writing Code:
1. Read the existing file
2. Search for similar components
3. Verify all imports are available
4. Check design system tokens exist

### After Writing Code:
1. Syntax correct?
2. Imports valid?
3. Props match usage?
4. TypeScript types correct?
5. Responsive breakpoints included?
6. Accessibility attributes present?

---

## 🎯 Best Practices

### Components
- Reuse existing components
- Follow naming conventions in codebase
- Use design tokens from globals.css
- Keep components focused (single responsibility)

### Animations
- Use Motion (not Framer Motion)
- Respect `prefers-reduced-motion`
- Keep durations: 200-600ms
- Use easing: `[0.22, 1, 0.36, 1]`

### Responsive
- Mobile-first approach
- Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Test all viewport sizes

### Performance
- Lazy load images
- Use IntersectionObserver for scroll
- Animate only `transform` and `opacity`
- Avoid layout thrashing

---

## 📊 Quality Checklist (Run Before Saying "Done")

```
FUNCTIONALITY
[ ] Code runs without errors
[ ] All features work as specified
[ ] Edge cases handled

DESIGN
[ ] Matches existing style system
[ ] Responsive (mobile/tablet/desktop)
[ ] Proper spacing and typography
[ ] Colors from design tokens

PERFORMANCE
[ ] No unnecessary re-renders
[ ] Images optimized
[ ] Animations smooth (60fps)

ACCESSIBILITY
[ ] Keyboard navigation works
[ ] Screen reader friendly
[ ] Sufficient color contrast
[ ] Touch targets ≥44px mobile

CODE QUALITY
[ ] No duplicate code
[ ] Clear variable names
[ ] Follows existing patterns
[ ] TypeScript types correct
```

---

## 🔄 Validation Process

1. **Syntax Check** - Does it compile?
2. **Logic Check** - Does it make sense?
3. **Pattern Check** - Matches existing code?
4. **Integration Check** - Works with other components?
5. **Design Check** - Matches design system?

---

## 📏 Code Standards

### File Organization
```
/components/[feature]/ComponentName.tsx
/pages/PageName.tsx
/lib/[category]/filename.ts
/docs/[section]/topic.md
```

### Import Order
1. React imports
2. External libraries
3. Internal components
4. Utils/helpers
5. Types
6. Styles

### Component Structure
1. Imports
2. Types/Interfaces
3. Component function
4. Return JSX
5. Export

---

## ⚡ Quick Rules

| Situation | Action |
|-----------|--------|
| Need image | Use `unsplash_tool` |
| Need icon | Verify in lucide-react first |
| Edit file | Use `fast_apply_tool` |
| New component | Check if exists first |
| Animation | Use Motion package |
| Responsive | Mobile-first, use breakpoints |
| Colors | Use design tokens only |
| Typography | Use globals.css defaults |

---

## 🎨 Design System Rules

**Typography:**
- Don't add font-size classes unless requested
- Don't add font-weight unless requested  
- Use semantic HTML (h1, h2, p, etc.)

**Colors:**
- Use CSS variables from globals.css
- Primary: Amber/Orange gradient
- Text: Slate-900/Slate-600
- Background: White/Stone-50

**Spacing:**
- Use Tailwind scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Section padding: py-24 lg:py-32
- Container: max-w-7xl mx-auto px-6

**Shadows:**
- Card: shadow-lg
- Hover: shadow-xl
- Custom: Only when necessary

---

## 🚨 Error Prevention

### Common Mistakes to Avoid
1. Importing icons that don't exist (check first!)
2. Using wrong import paths (verify!)
3. Overriding typography defaults
4. Creating duplicate components
5. Forgetting mobile responsive
6. Missing accessibility attributes
7. Animating width/height (use transform!)

### Pre-Ship Checklist
```
[ ] No console errors
[ ] No TypeScript errors
[ ] Works on mobile
[ ] Works on desktop
[ ] Animations smooth
[ ] Images load properly
[ ] Links work
[ ] Forms validate
```

---

## 📝 Documentation Rules

**When to Create Docs:**
- New architecture pattern
- Complex system explanation
- API integration guide
- Setup instructions

**When NOT to Create Docs:**
- Summaries of work done
- Repeating existing info
- Explanatory README files
- Progress reports

**Format:**
- Use checklists
- Be concise
- Include examples
- One source of truth

---

## ✅ Definition of Done

Code is done when:
1. ✅ Runs without errors
2. ✅ Passes quality checklist
3. ✅ Matches design system
4. ✅ Responsive on all devices
5. ✅ Accessible
6. ✅ Follows existing patterns
7. ✅ No duplicate functionality

---

**Use this file as the source of truth for quality standards.**
