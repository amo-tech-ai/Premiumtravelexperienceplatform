# FIGMA SYSTEM PLAN
## Design System Integration Architecture

**Document:** 11-figma-system-plan.md  
**Last Updated:** December 22, 2024  
**Purpose:** Plan for Figma-to-code workflow

---

## 🎯 FIGMA INTEGRATION STRATEGY

### Phase 1: Design System
- Create tokens in Figma
- Define component library
- Establish naming conventions
- Document usage guidelines

### Phase 2: Component Library
- Build all UI primitives
- Create composite components
- Define variants and states
- Test responsiveness

### Phase 3: Screen Designs
- Design all core screens
- Create responsive layouts
- Define interactions
- Annotate specifications

### Phase 4: Handoff
- Export assets
- Document components
- Provide implementation notes
- Review with developers

---

## 🎨 DESIGN TOKENS

### Colors
```
Primary: #064E3B
Accent: #FBBF24
Background: #F7F7F5
Destructive: #D4183D
```

### Typography
```
Serif: Playfair Display (400, 500, 600, 700)
Sans: Inter (300, 400, 500, 600)
```

### Spacing
```
Base: 4px
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
```

### Radius
```
Small: 8px
Medium: 12px
Large: 16px
```

---

## 📐 COMPONENT STRUCTURE

### Primitives (20+)
- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Slider
- Textarea
- Badge
- Avatar
- ...

### Composite (50+)
- Card
- Modal
- Dropdown
- Navigation
- Table
- Form
- Tabs
- Accordion
- ...

---

## 🔄 FIGMA-TO-CODE WORKFLOW

### 1. Design in Figma
- Use Auto Layout
- Name layers properly
- Apply consistent spacing
- Use components

### 2. Export
- Export SVGs for icons
- Export images at 2x
- Generate CSS tokens
- Document measurements

### 3. Implement
- Build components in React
- Apply Tailwind classes
- Match Figma spacing
- Test responsiveness

### 4. Validate
- Compare with Figma
- Check all states
- Test interactions
- Verify accessibility

---

## ✅ QUALITY CHECKLIST

### Design Quality
- [ ] Follows design system
- [ ] Consistent spacing
- [ ] Proper hierarchy
- [ ] Accessible contrast

### Technical Quality
- [ ] Auto Layout used
- [ ] Components used
- [ ] Proper naming
- [ ] Responsive design

### Handoff Quality
- [ ] Assets exported
- [ ] Specs documented
- [ ] States defined
- [ ] Interactions noted

---

**Document Location:** `/docs/figma-prompts/11-figma-system-plan.md`  
**Previous Location:** `/docs/09-figma-system-plan.md`  
**Full workflow:** See original file for complete process
