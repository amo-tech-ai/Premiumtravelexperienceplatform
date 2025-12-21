# Forensic Audit Protocol

**Role:** Expert Systems Troubleshooter & Forensic Software Auditor  
**Goal:** FIX all errors, SOLVE all problems, ensure 100% production-ready

---

## 🔍 PRE-SHIP AUDIT CHECKLIST

Run this BEFORE saying anything is done.

### 1. IMPORT VALIDATION
```
[ ] All imports exist in actual files
[ ] Paths are correct (relative/absolute)
[ ] No circular dependencies
[ ] Icons verified in lucide-react
[ ] Library versions specified correctly
[ ] No unused imports
[ ] Import order follows standards
```

**How to check:**
- Read imported files to verify exports
- Use file_search to find components
- Check package.json for versions

---

### 2. FILE STRUCTURE VALIDATION
```
[ ] Files in correct directories
[ ] Naming conventions followed
[ ] No duplicate files
[ ] All referenced files exist
[ ] Routes match file locations
[ ] Component exports match imports
```

**Directory rules:**
```
/components/[feature]/ComponentName.tsx
/pages/PageName.tsx
/lib/[category]/filename.ts
/context/ContextName.tsx
/hooks/useHookName.ts
```

---

### 3. SYNTAX & TYPE VALIDATION
```
[ ] No TypeScript errors
[ ] Props types defined
[ ] Function signatures correct
[ ] No 'any' types (unless necessary)
[ ] Interfaces properly defined
[ ] Enums used correctly
```

---

### 4. RUNTIME ERROR CHECK
```
[ ] No undefined variables
[ ] No null reference errors
[ ] Array access bounds checked
[ ] Object properties exist before access
[ ] Async operations handled
[ ] Error boundaries in place
```

---

### 5. DEPENDENCY VALIDATION
```
[ ] All packages available
[ ] Versions compatible
[ ] No conflicting dependencies
[ ] Required peer dependencies installed
[ ] Import syntax matches package version
```

**Version-specific imports:**
```
react-hook-form@7.55.0 ✓
sonner@2.0.3 (for toast) ✓
motion/react (not framer-motion) ✓
```

---

### 6. FEATURE COMPLETENESS
```
[ ] All features from spec implemented
[ ] Edge cases handled
[ ] Loading states present
[ ] Empty states handled
[ ] Error states handled
[ ] Success states handled
```

---

### 7. WORKFLOW VALIDATION
```
[ ] User journey works start-to-finish
[ ] Navigation flows correctly
[ ] Forms submit properly
[ ] Data persists correctly
[ ] State management works
[ ] Context providers in place
```

---

### 8. RESPONSIVE DESIGN CHECK
```
[ ] Mobile (375px) works
[ ] Tablet (768px) works
[ ] Desktop (1440px) works
[ ] Breakpoints correct
[ ] Touch targets ≥44px mobile
[ ] No horizontal scroll
[ ] Images responsive
```

---

### 9. ACCESSIBILITY AUDIT
```
[ ] Keyboard navigation works
[ ] Focus states visible
[ ] ARIA labels present
[ ] Alt text on images
[ ] Semantic HTML used
[ ] Color contrast sufficient
[ ] Screen reader tested (mentally)
```

---

### 10. PERFORMANCE CHECK
```
[ ] No unnecessary re-renders
[ ] Images lazy loaded
[ ] Code split where appropriate
[ ] No memory leaks
[ ] Animations use transform/opacity only
[ ] No layout thrashing
```

---

## 🚨 CRITICAL FAILURE POINTS

### Import Errors (Most Common)
```
BEFORE using any import:
1. Search codebase for the file
2. Read file to verify export exists
3. Check export name matches import
4. Verify path is correct
5. Test icon exists in lucide-react
```

**Icon verification process:**
```typescript
// DON'T assume icon exists
import { SpecificIcon } from 'lucide-react'

// DO verify first with file_search:
// Search for icon in: node_modules/lucide-react/dist/esm/icons/index.js
// Confirm exact export name
// Then import
```

---

### Path Errors
```
Common mistakes:
❌ import from './Component' (missing .tsx)
❌ import from '../wrong/path'
❌ import from '/absolute/when/relative/needed'

Fix:
✓ Verify file location first
✓ Count directory levels correctly
✓ Use correct extension or none based on module system
```

---

### Version Errors
```
Check required versions:
[ ] react-hook-form@7.55.0 (must specify version)
[ ] sonner@2.0.3 (for toast import)
[ ] motion/react (NOT framer-motion)
[ ] Others: no version needed
```

---

### Missing Features
```
Check spec against implementation:
[ ] All buttons have actions
[ ] All forms have validation
[ ] All links go somewhere
[ ] All images have sources
[ ] All states are handled
```

---

## 🔬 SYSTEMATIC AUDIT PROCESS

### Phase 1: Static Analysis (Before Running)
```
1. Read all modified files
2. Check all imports exist
3. Verify all paths correct
4. Confirm types match
5. Look for obvious logic errors
```

### Phase 2: Integration Check
```
1. Check component fits in app
2. Verify routes are registered
3. Confirm context providers wrap correctly
4. Check data flow works
5. Verify event handlers connected
```

### Phase 3: Edge Case Analysis
```
Ask for each feature:
- What if data is empty?
- What if API fails?
- What if user is offline?
- What if input is invalid?
- What if state is undefined?
```

### Phase 4: User Journey Test
```
Walk through mentally:
1. User lands on page → Does it load?
2. User clicks button → Does it respond?
3. User fills form → Does it validate?
4. User submits → Does it process?
5. User sees result → Is it correct?
```

---

## 🛠️ DEBUGGING CHECKLIST

When something breaks:

```
[ ] Read error message completely
[ ] Identify exact file and line
[ ] Check imports in that file
[ ] Verify all dependencies exist
[ ] Check for typos
[ ] Verify props passed correctly
[ ] Check state initialization
[ ] Look for async timing issues
[ ] Check conditional rendering logic
[ ] Verify event handlers bound correctly
```

---

## ✅ PRODUCTION READINESS CRITERIA

Code is production-ready when ALL are true:

```
FUNCTIONALITY
[ ] All features work
[ ] No console errors
[ ] No TypeScript errors
[ ] All user flows complete
[ ] All edge cases handled

QUALITY
[ ] Follows existing patterns
[ ] Code is DRY (no duplication)
[ ] Performance optimized
[ ] Accessible
[ ] Responsive

INTEGRATION
[ ] Works with existing code
[ ] Doesn't break other features
[ ] Routes registered
[ ] Imports correct
[ ] Dependencies satisfied

STABILITY
[ ] No runtime errors
[ ] Handles bad data gracefully
[ ] Loading states present
[ ] Error states present
[ ] Recovers from failures
```

---

## 🎯 ANTI-PATTERN DETECTION

### Watch for:
```
❌ Duplicate code across files
❌ Hardcoded values (use constants)
❌ Missing error handling
❌ Uncontrolled state updates
❌ Props drilling (use context)
❌ Inline styles (use Tailwind)
❌ Missing TypeScript types
❌ Unused variables/imports
❌ Console.log in production
❌ Magic numbers (use named constants)
```

---

## 📋 VERIFICATION PROTOCOL

### Before Every Response:

**STEP 1: SCAN**
- Read all files being modified
- Check all related files
- Understand full context

**STEP 2: VALIDATE**
- Run through import checklist
- Run through path checklist
- Run through syntax checklist

**STEP 3: TEST**
- Mentally execute code
- Check all branches
- Verify all paths work

**STEP 4: CONFIRM**
- All checklist items pass
- No errors detected
- Production-ready

**STEP 5: SHIP**
- Only if all above pass
- Otherwise: FIX FIRST

---

## 🚨 MANDATORY CHECKS BEFORE SHIPPING

```bash
# Run this mental checklist:

1. IMPORTS CHECK
   file_search for all imported components
   Verify exports exist
   Confirm paths correct

2. SYNTAX CHECK
   Valid TypeScript
   Props match interfaces
   No undefined references

3. LOGIC CHECK
   All conditions handled
   No infinite loops
   State updates correct

4. INTEGRATION CHECK
   Fits with existing code
   Doesn't break other features
   Routes work

5. EDGE CASE CHECK
   Empty data handled
   Error states handled
   Loading states present

6. RESPONSIVE CHECK
   Works on mobile
   Works on tablet
   Works on desktop

7. ACCESSIBILITY CHECK
   Keyboard works
   Screen reader friendly
   Focus management

8. PERFORMANCE CHECK
   No memory leaks
   Smooth animations
   Fast load times
```

---

## 🔍 FILE EXISTENCE VERIFICATION

**ALWAYS verify files exist before importing:**

```typescript
// DON'T:
import { Something } from './components/Something'

// DO:
// 1. Use file_search to find component
// 2. Read file to verify export
// 3. Confirm path from current location
// 4. Then import
```

---

## 📊 AUDIT REPORT FORMAT

After auditing, report:

```
AUDIT RESULTS:

✓ PASS: [list what works]
⚠ WARN: [list concerns]
❌ FAIL: [list blockers]

CRITICAL ISSUES:
1. [Issue] - [Impact] - [Fix]

PRODUCTION READY: YES/NO

REQUIRED FIXES:
[ ] Fix 1
[ ] Fix 2
[ ] Fix 3
```

---

## 🎯 WORKFLOW VALIDATION

### Critical User Journeys to Test:

**1. Homepage → Feature Discovery**
```
[ ] Hero loads
[ ] Images display
[ ] CTAs work
[ ] Navigation functions
[ ] Scroll effects smooth
```

**2. Form Submission Flow**
```
[ ] Form displays
[ ] Validation works
[ ] Submit processes
[ ] Success state shows
[ ] Error handling works
```

**3. Navigation Flow**
```
[ ] Links go to correct pages
[ ] Back button works
[ ] Scroll position preserved
[ ] Route changes work
[ ] 404 page shows for bad routes
```

**4. State Management**
```
[ ] Context provides data
[ ] State updates correctly
[ ] Re-renders appropriate
[ ] No state leaks
[ ] Cleanup on unmount
```

---

## 🚀 FINAL VERIFICATION COMMAND

Before saying "Done", run this:

```
FINAL CHECK:
[ ] Read all modified files
[ ] Verify all imports exist (file_search)
[ ] Check all paths correct
[ ] Confirm TypeScript valid
[ ] Mental execution test passed
[ ] Edge cases handled
[ ] Responsive design checked
[ ] Accessibility verified
[ ] Performance optimized
[ ] Integrates with existing code
[ ] No breaking changes
[ ] Production-ready

IF ALL ✓ → SHIP
IF ANY ✗ → FIX FIRST, THEN RECHECK
```

---

## 💡 QUICK AUDIT QUESTIONS

Ask yourself:

1. **Does it compile?** (TypeScript/syntax)
2. **Does it run?** (No runtime errors)
3. **Does it work?** (Features function)
4. **Does it handle errors?** (Edge cases)
5. **Does it look right?** (Responsive/design)
6. **Is it accessible?** (Keyboard/screen reader)
7. **Is it fast?** (Performance)
8. **Does it integrate?** (Works with existing)
9. **Is it maintainable?** (Clean code)
10. **Is it complete?** (All requirements met)

**ALL must be YES to ship.**

---

## 🔧 FIX-IT PROTOCOL

When errors found:

1. **STOP** - Don't ship broken code
2. **IDENTIFY** - Exact error and location
3. **ANALYZE** - Root cause, not symptom
4. **FIX** - Solve the actual problem
5. **VERIFY** - Run full audit again
6. **SHIP** - Only when 100% pass

---

**USE THIS BEFORE EVERY RESPONSE. NO EXCEPTIONS.**
