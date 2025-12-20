# Documentation Organization System

**Date:** December 20, 2024  
**Purpose:** Master index and filing rules

---

## 📂 Directory Structure

```
/docs/
├── FILE-ORGANIZATION-SYSTEM.md       ← Master index (this file)
├── 01-foundation/                    ← Design & architecture
├── 02-supabase/                      ← Database & backend
├── 03-features/                      ← Feature specifications
├── 04-agents/                        ← AI agent specs
├── 05-components/                    ← Component docs
├── 06-api/                           ← API documentation
├── 07-deployment/                    ← Deploy & ops
└── 08-archive/                       ← Old/deprecated
```

---

## 📋 Filing Rules

### 01-foundation/
**Purpose:** Core architecture, design system, project setup

**What Goes Here:**
- Design system plans
- Directory structure
- Routing architecture
- Typography & color systems
- Core implementation plans
- Foundation audits

**Naming:** `##-descriptive-name.md` (numbered)

**Current Files:** 12

---

### 02-supabase/
**Purpose:** Database, backend, Supabase schemas

**What Goes Here:**
- Database schemas
- Table definitions
- RLS policies
- Migration plans
- Supabase setup guides
- Backend architecture

**Naming:** `##-schema-name.md` or `##-feature-schema.md`

**Current Files:** 13 (if they exist from previous work)

---

### 03-features/
**Purpose:** Feature specifications and requirements

**What Goes Here:**
- Feature requirements
- User stories
- Workflow diagrams
- Feature implementation plans
- MVP definitions
- Feature audits

**Naming:** `##-feature-name.md`

**Current Files:** TBD

---

### 04-agents/
**Purpose:** AI agent specifications

**What Goes Here:**
- Agent architecture
- Event bus design
- Agent responsibilities
- Communication protocols
- AI integration specs
- Proactive assistant docs
- Collaboration engine

**Naming:** `##-agent-name.md` or `##-system-name.md`

**Current Files:** TBD

---

### 05-components/
**Purpose:** React component documentation

**What Goes Here:**
- Component API docs
- Props documentation
- Usage examples
- Component hierarchy
- Storybook links

**Naming:** `ComponentName.md` (PascalCase)

**Current Files:** TBD

---

### 06-api/
**Purpose:** API documentation

**What Goes Here:**
- API endpoints
- Request/response formats
- Authentication
- Rate limiting
- Error codes
- Integration guides

**Naming:** `##-api-section.md`

**Current Files:** TBD

---

### 07-deployment/
**Purpose:** Deployment and operations

**What Goes Here:**
- Deployment guides
- Environment setup
- CI/CD pipelines
- Monitoring
- Error tracking
- Performance optimization

**Naming:** `##-deployment-topic.md`

**Current Files:** TBD

---

### 08-archive/
**Purpose:** Deprecated or outdated docs

**What Goes Here:**
- Old versions
- Deprecated features
- Historical decisions
- Superseded plans

**Naming:** `ARCHIVED-original-name.md`

**Current Files:** TBD

---

## 📁 Current Inventory

### /docs/01-foundation/ (12 files)

| # | File | Type | Status |
|---|------|------|--------|
| 00 | `00-STATUS.md` | Status | ✅ |
| 01 | `01-fix-design-system.md` | Plan | ✅ |
| 02 | `02-directory-routing.md` | Plan | ✅ |
| 03 | `03-audit-assessment.md` | Audit | ✅ |
| 04 | `04-corrections-applied.md` | Audit | ✅ |
| 05 | `05-implementation-checklist.md` | Tracker | ✅ |
| 06 | `06-forensic-audit.md` | Audit | ✅ |
| 07 | `07-master-checklist.md` | Tracker | ✅ |
| - | `AUDIT-COMPLETE.md` | Summary | ✅ |
| - | `EXECUTIVE-SUMMARY.md` | Summary | ✅ |
| - | `INDEX.md` | Navigation | ✅ |
| - | `README.md` | Overview | ✅ |

---

## 🏷️ Naming Conventions

### Numbered Files (Sequential)
**Format:** `##-descriptive-name.md`

**Use For:**
- Implementation plans (01, 02, 03...)
- Sequential processes
- Phase-based docs

**Examples:**
- `01-fix-design-system.md`
- `02-directory-routing.md`
- `03-database-schema.md`

---

### Status Files (All Caps)
**Format:** `STATUS-TYPE.md` or `00-STATUS.md`

**Use For:**
- Quick status reports
- Executive summaries
- Audit completions
- Index files

**Examples:**
- `00-STATUS.md`
- `AUDIT-COMPLETE.md`
- `EXECUTIVE-SUMMARY.md`
- `INDEX.md`
- `README.md`

---

### Feature Files (Descriptive)
**Format:** `feature-name-type.md`

**Use For:**
- Feature specs
- Component docs
- Specific implementations

**Examples:**
- `itinerary-drag-drop.md`
- `ai-agent-spec.md`
- `event-bus-design.md`

---

## 📏 Document Standards

### Every Document Must Have:
1. **Title** (H1)
2. **Date** (YYYY-MM-DD)
3. **Status** (emoji + text)
4. **Purpose** (1 sentence)
5. **Content** (organized with H2/H3)
6. **Checklist** (if actionable)

### File Sizes:
- **Short:** <500 words (summaries, status)
- **Medium:** 500-2000 words (specs, guides)
- **Long:** 2000+ words (implementation plans)

### Avoid:
- ❌ Duplicate content
- ❌ Long summaries
- ❌ Redundant explanations
- ❌ Unnecessary documentation

---

## 🔄 Maintenance Rules

### When to Create New Doc:
- New feature specification
- New implementation plan
- Major architecture change
- Audit/assessment results

### When to Update Existing:
- Small changes to plans
- Status updates
- Corrections
- Progress tracking

### When to Archive:
- Feature deprecated
- Plan superseded
- Old version kept for reference

---

## 🎯 Quick Reference

**Need to file a document? Ask:**

1. **Is it foundation/architecture?** → `01-foundation/`
2. **Is it database/backend?** → `02-supabase/`
3. **Is it a feature spec?** → `03-features/`
4. **Is it AI/agent related?** → `04-agents/`
5. **Is it component docs?** → `05-components/`
6. **Is it API documentation?** → `06-api/`
7. **Is it deployment/ops?** → `07-deployment/`
8. **Is it old/deprecated?** → `08-archive/`

---

## 📊 Statistics

**Total Folders:** 8  
**Total Files:** 13 (12 in foundation + 1 index)  
**Organization:** ✅ Complete  
**System:** ✅ Established

---

**Last Updated:** December 20, 2024  
**Maintained By:** Project Documentation Team
