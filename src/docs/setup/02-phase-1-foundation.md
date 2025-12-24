# PHASE 1: PROJECT FOUNDATION
## Vite + TypeScript + Path Aliases + Folder Structure

**Document:** 02-phase-1-foundation.md  
**Phase:** 1 of 11  
**Duration:** 30-45 minutes  
**Prerequisites:** Node.js 18+, npm/pnpm installed  
**Status:** Ready to Execute

---

## PHASE OBJECTIVE

Create a clean Vite + React + TypeScript project with professional folder structure, absolute path imports, and zero technical debt from day one.

---

## SUCCESS CRITERIA

- Vite dev server runs without errors
- TypeScript compiles in strict mode
- Absolute imports work using @ alias
- Complete folder structure matches architecture
- Build passes and creates production bundle
- Git repository initialized with clean .gitignore

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Create Vite Project

**Action:** Initialize new Vite project with React TypeScript template  
**Command Pattern:** Use npm create vite with latest flag, project name "i-love-medellin", template react-ts  
**Verification:** Project folder created with package.json, src folder, and vite.config.ts present

### Step 2: Navigate and Install Dependencies

**Action:** Change into project directory and install base packages  
**Command Pattern:** cd into project, run npm install  
**Verification:** node_modules folder created, package-lock.json generated, no installation errors

### Step 3: Configure Path Aliases

**Action:** Set up @ alias to point to src directory for clean imports  

**File 1 - tsconfig.json:**  
Add paths mapping under compilerOptions. Map @ to array containing ./src/*. Map @/* to array containing ./src/*.  

**File 2 - tsconfig.app.json:**  
Extend from tsconfig.json. Ensure paths configuration inherited or duplicated.  

**File 3 - vite.config.ts:**  
Import path module from node. Import resolve from path. Add resolve.alias object to config. Map @ symbol to path.resolve with __dirname and src.  

**Verification:** Create test file importing from @/lib/utils should compile without errors

### Step 4: Update TypeScript to Strict Mode

**Action:** Enable all strict TypeScript checks for maximum safety  

**File - tsconfig.json compilerOptions:**  
Set strict to true. Set noUnusedLocals to true. Set noUnusedParameters to true. Set noFallthroughCasesInSwitch to true. Set skipLibCheck to true for faster builds.  

**Verification:** Run npx tsc --noEmit should complete with zero errors

### Step 5: Create Complete Folder Structure

**Action:** Create all directories from architecture document  

**Top Level Directories in src:**  
Create app folder with subdirectories providers, layouts, guards. Create routes folder. Create pages folder with subdirectories marketing, auth, app, trips, events, restaurants, rentals, errors. Create components folder with subdirectories ui, shared, ai, layouts. Create features folder with subdirectories trips, events, restaurants, rentals, auth, ai. Create lib folder with subdirectories api, supabase, utils. Create types folder. Create styles folder with subdirectory fonts. Create assets folder with subdirectories images, icons, illustrations.  

**Command Pattern:** Use mkdir -p for nested directory creation in single command  

**Verification:** Run tree command or ls -R shows complete structure matching architecture

### Step 6: Create Index Files for Documentation

**Action:** Add index.ts or README.md files to major folders explaining purpose  

**Files to Create:**  
app/README.md explaining providers, layouts, guards purpose. features/README.md explaining feature isolation rules. components/README.md explaining ui components vs shared components. lib/README.md explaining shared utilities and API client. types/README.md explaining centralized type definitions.  

**Content Pattern:** Each README should state folder purpose, what belongs here, what does NOT belong here, import rules  

**Verification:** Each major folder has documentation file explaining its role

### Step 7: Initialize Git Repository

**Action:** Set up version control with proper ignores  

**Git Commands:**  
Initialize git repository. Create .gitignore file. Add node_modules, dist, .env.local, .DS_Store, coverage to gitignore. Create initial commit with message "Initial project foundation".  

**Verification:** Run git status shows clean working tree, .env.local would be ignored

### Step 8: Create Environment Variable Template

**Action:** Document required environment variables  

**File - .env.example:**  
Add comment header explaining this is template for .env.local. List VITE_SUPABASE_URL with placeholder value. List VITE_SUPABASE_ANON_KEY with placeholder. List VITE_GEMINI_API_KEY with placeholder. List VITE_APP_URL with localhost default. Add instructions to copy to .env.local and fill real values.  

**File - .env.local:**  
Copy from .env.example. Leave values as placeholders for now. Will be filled in auth phase.  

**Verification:** .env.example committed to git, .env.local ignored by git

### Step 9: Update Package.json Scripts

**Action:** Add helpful scripts for development workflow  

**Scripts to Add or Verify:**  
dev script runs vite. build script runs tsc and vite build. preview script runs vite preview. lint script runs eslint if configured. typecheck script runs tsc --noEmit.  

**Verification:** npm run dev starts dev server, npm run build creates dist folder

### Step 10: Clean Up Default Files

**Action:** Remove Vite template boilerplate files  

**Files to Delete:**  
Delete src/App.css. Delete src/index.css content (will be replaced with Tailwind). Delete public/vite.svg. Keep public folder for future assets.  

**Files to Modify:**  
Clear src/App.tsx to minimal component. Clear src/main.tsx to minimal React render. Keep structure, remove default content.  

**Verification:** App still runs but shows blank or minimal content

### Step 11: Verify TypeScript Configuration

**Action:** Test that path aliases and strict mode work correctly  

**Test 1 - Create Dummy File:**  
Create src/lib/utils.ts with single export function. Create src/pages/marketing/HomePage.tsx importing from @/lib/utils. Verify import resolves without errors.  

**Test 2 - Run Type Check:**  
Execute npx tsc --noEmit. Should complete with zero errors. Intentionally add type error, verify TypeScript catches it.  

**Verification:** TypeScript compiles, path aliases resolve, strict mode enforces types

### Step 12: Verify Build Pipeline

**Action:** Ensure production build works  

**Build Test:**  
Run npm run build. Check terminal output for errors. Verify dist folder created. Check dist/index.html exists. Check dist/assets folder contains JS and CSS chunks.  

**Preview Test:**  
Run npm run preview. Open browser to preview URL. Verify app renders without console errors.  

**Verification:** Build completes successfully, preview server runs, no runtime errors

---

## VALIDATION CHECKLIST

### Critical Checks

- [ ] npm run dev starts without errors
- [ ] Browser shows app at localhost:5173
- [ ] Console has no red errors
- [ ] Import from @/lib/utils compiles successfully
- [ ] TypeScript strict mode enabled in tsconfig.json
- [ ] All folders from architecture document exist
- [ ] Git repository initialized
- [ ] .env.example exists and documented
- [ ] .env.local exists and gitignored
- [ ] npm run build completes successfully
- [ ] dist folder generated with index.html
- [ ] npm run preview runs production build
- [ ] npx tsc --noEmit returns zero errors
- [ ] package.json has all core scripts
- [ ] README.md files exist in major folders

### File Structure Verification

- [ ] src/app/providers/ exists
- [ ] src/app/layouts/ exists
- [ ] src/app/guards/ exists
- [ ] src/routes/ exists
- [ ] src/pages/marketing/ exists
- [ ] src/pages/auth/ exists
- [ ] src/pages/trips/ exists
- [ ] src/components/ui/ exists
- [ ] src/features/trips/ exists
- [ ] src/lib/api/ exists
- [ ] src/types/ exists
- [ ] src/styles/ exists
- [ ] src/assets/ exists

### Configuration Verification

- [ ] tsconfig.json has paths with @ alias
- [ ] vite.config.ts has resolve.alias for @
- [ ] tsconfig.json has strict: true
- [ ] .gitignore includes node_modules
- [ ] .gitignore includes .env.local
- [ ] .gitignore includes dist

---

## TROUBLESHOOTING

### Issue: Path Alias Not Resolving

**Symptom:** Import from @/lib/utils shows "cannot find module" error  
**Cause:** TypeScript config or Vite config missing alias  
**Solution:** Verify both tsconfig.json paths and vite.config.ts resolve.alias configured. Restart TypeScript server and Vite dev server.

### Issue: TypeScript Errors in node_modules

**Symptom:** TypeScript shows errors from third-party packages  
**Cause:** skipLibCheck not enabled  
**Solution:** Add skipLibCheck: true to tsconfig.json compilerOptions. Run typecheck again.

### Issue: Build Fails with Module Errors

**Symptom:** npm run build fails with cannot resolve module  
**Cause:** Vite config missing path alias resolution  
**Solution:** Ensure vite.config.ts has resolve.alias with @ mapped to src directory using path.resolve.

### Issue: Git Tracking .env.local

**Symptom:** git status shows .env.local in changes  
**Cause:** .gitignore created after file  
**Solution:** Add .env.local to .gitignore. Run git rm --cached .env.local to untrack. Commit gitignore change.

---

## NEXT PHASE PREVIEW

**Phase 2:** Install and configure React Router 6 with data router pattern. Set up route structure and navigation architecture. Create route modules for marketing, auth, and app sections.

**What You'll Need:** This phase complete with passing validation checklist. Basic understanding of React Router v6 concepts.

**Estimated Time:** 45-60 minutes

---

**Phase Status:** ✅ Ready to Execute  
**Last Updated:** December 24, 2024  
**Dependencies:** None (first phase)  
**Blocks:** Phase 2 (routing requires foundation)
