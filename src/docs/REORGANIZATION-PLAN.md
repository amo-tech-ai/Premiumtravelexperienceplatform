# Documentation Reorganization Plan

**Date:** December 20, 2024  
**Status:** 🔴 Action Required  
**Priority:** HIGH

---

## 🎯 Problem

**Current State:** Disorganized documentation
- ❌ Files scattered in root `/docs/`
- ❌ Inconsistent naming (numbers, names, mixed)
- ❌ Duplicate folders (`02-design`, `design`)
- ❌ Hard to find documents
- ❌ No clear system

**Goal:** Clean, systematic organization

---

## 📂 New Structure

```
/docs/
├── FILE-ORGANIZATION-SYSTEM.md       ← Master index
├── REORGANIZATION-PLAN.md            ← This file
│
├── 01-foundation/                    ← ✅ DONE (12 files)
│   ├── 00-STATUS.md
│   ├── 01-fix-design-system.md
│   ├── 02-directory-routing.md
│   └── ... (9 more)
│
├── 02-supabase/                      ← Database schemas
│   └── (move from /docs/supabase/)
│
├── 03-features/                      ← Feature specs
│   └── (move from /docs/features/)
│
├── 04-agents/                        ← AI agents
│   └── (move from /docs/ai-features/)
│
├── 05-components/                    ← Component docs
│   └── (move from /docs/global-components.md)
│
├── 06-production/                    ← Prod & deployment
│   └── (move from /docs/05-production/)
│
├── 07-archive/                       ← Old files
│   └── (move deprecated docs here)
│
└── 08-working/                       ← Active work
    └── (temporary workspace)
```

---

## 📋 File Mapping

### Current → New Location

**Root Files to Move:**
```
00-index.md                    → 08-working/00-index.md (or archive)
02-prompts.md                  → 07-archive/
03-realestate.md               → 07-archive/
03-system-plan.md              → 07-archive/
04-system-plan-prompts.md      → 07-archive/
05-design-code-contracts.md    → 01-foundation/08-contracts.md
06-handoff-contract.md         → 01-foundation/09-handoff.md
07-mega-implementation-prompts.md → 07-archive/
08-system-prompts-plan-next.md → 07-archive/
09-figma-system-plan.md        → 01-foundation/10-figma-plan.md
10-figma-page-structure.md     → 01-foundation/11-figma-structure.md
11-ai-features.md              → 04-agents/01-ai-features.md
12-figma-screens-prompts.md    → 07-archive/
13-figma-advanced-specs.md     → 01-foundation/12-advanced-specs.md
14-progress-tracker-system.md  → 08-working/progress-tracker.md
IMPLEMENTATION_PLAN.md         → 07-archive/
PRODUCTION_ENHANCEMENTS.md     → 06-production/01-enhancements.md
global-components.md           → 05-components/01-global.md
navigation_flow.md             → 03-features/01-navigation.md
phase-4-implementation-notes.md → 07-archive/
phase-5-implementation-notes.md → 07-archive/
phase-6-refinement-notes.md    → 07-archive/
phase-7-integration-notes.md   → 07-archive/
prd.md                         → 07-archive/
prdV2.md                       → 03-features/00-PRD.md
sitemap.md                     → 03-features/02-sitemap.md
style-guide.md                 → 01-foundation/13-style-guide.md
```

**Folders to Move:**
```
/docs/supabase/                → /docs/02-supabase/
/docs/features/                → /docs/03-features/
/docs/ai-features/             → /docs/04-agents/
/docs/05-production/           → /docs/06-production/
/docs/progress/                → /docs/08-working/progress/
/docs/tasks/                   → /docs/08-working/tasks/
```

**Folders to Archive:**
```
/docs/02-design/               → /docs/07-archive/02-design/
/docs/03-implementation/       → /docs/07-archive/03-implementation/
/docs/04-ai/                   → /docs/07-archive/04-ai/
/docs/06-reports/              → /docs/07-archive/06-reports/
/docs/architecture/            → /docs/07-archive/architecture/
/docs/figma-prompts/           → /docs/07-archive/figma-prompts/
/docs/wizards/                 → /docs/07-archive/wizards/
```

---

## ✅ Action Checklist

### Phase 1: Create New Folders
- [ ] Create `/docs/02-supabase/`
- [ ] Create `/docs/03-features/`
- [ ] Create `/docs/04-agents/`
- [ ] Create `/docs/05-components/`
- [ ] Create `/docs/06-production/`
- [ ] Create `/docs/07-archive/`
- [ ] Create `/docs/08-working/`

### Phase 2: Move Active Files
- [ ] Move supabase files → `02-supabase/`
- [ ] Move feature files → `03-features/`
- [ ] Move AI files → `04-agents/`
- [ ] Move component docs → `05-components/`
- [ ] Move production docs → `06-production/`

### Phase 3: Archive Old Files
- [ ] Move phase notes → `07-archive/`
- [ ] Move old prompts → `07-archive/`
- [ ] Move deprecated folders → `07-archive/`

### Phase 4: Clean Root
- [ ] Verify all files moved
- [ ] Delete empty folders
- [ ] Update index files

### Phase 5: Verify
- [ ] Check all links work
- [ ] Update README files
- [ ] Test navigation

---

## ⏱️ Estimated Time

**Total:** 2-3 hours

- Phase 1: 10 min
- Phase 2: 60 min
- Phase 3: 30 min
- Phase 4: 20 min
- Phase 5: 30 min

---

## 🚦 Decision Required

**Question:** Execute reorganization now?

**Options:**
1. ✅ **YES** — Clean up now (2-3 hours)
2. ⏸️ **LATER** — Continue with current structure
3. 🔄 **PARTIAL** — Move only critical files

**Recommendation:** Later — focus on implementation first, organize during downtime.

---

## 📊 Impact Analysis

**Benefits:**
- ✅ Clear organization
- ✅ Easy to find docs
- ✅ Consistent naming
- ✅ Better maintainability

**Risks:**
- ⚠️ Broken links (need to update)
- ⚠️ Time investment (2-3 hours)
- ⚠️ Temporary confusion

**Mitigation:**
- Update all internal links
- Create redirect index
- Document changes

---

**Status:** 🟡 Plan Ready, Awaiting Decision  
**Priority:** LOW (can wait until after implementation)
