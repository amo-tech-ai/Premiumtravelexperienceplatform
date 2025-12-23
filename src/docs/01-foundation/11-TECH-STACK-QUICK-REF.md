# ⚡ TECH STACK - QUICK REFERENCE
## One-Page Cheat Sheet

**Document:** 11-TECH-STACK-QUICK-REF.md  
**Last Updated:** December 22, 2024

---

## 🎯 CORE STACK

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | Latest |
| **Language** | TypeScript | Latest |
| **Build Tool** | Vite | Via Figma Make |
| **Styling** | Tailwind CSS | v4.0 |
| **Routing** | React Router | Latest |
| **Backend Runtime** | Deno | Edge Functions |
| **Backend Framework** | Hono | Latest |
| **Database** | Supabase PostgreSQL | Managed |
| **AI** | Google Gemini | 1.5 Flash/Pro |

---

## 📦 KEY PACKAGES

### **UI Components**
```typescript
// Radix UI (all components)
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-select
@radix-ui/react-tabs
// + 20 more Radix components

// Variant management
class-variance-authority@0.7.1
```

### **Icons & Charts**
```typescript
lucide-react           // 1000+ icons
recharts               // Charts & graphs
```

### **Forms & Validation**
```typescript
react-hook-form@7.55.0  // Form handling
```

### **Notifications & Animation**
```typescript
sonner@2.0.3           // Toast notifications
motion/react           // Animations (Framer Motion)
```

### **Backend**
```typescript
// Deno imports (npm: prefix)
npm:hono               // Web framework
npm:hono/cors          // CORS middleware
npm:hono/logger        // Request logging
npm:hono/streaming     // SSE streaming
```

### **AI**
```typescript
@google/generative-ai  // Gemini AI client
```

### **Database**
```typescript
@supabase/supabase-js  // Supabase client
```

---

## 🏗️ PROJECT STRUCTURE

```
/
├── App.tsx                  # Main app (45+ routes)
├── components/              # 200+ components
│   ├── ui/                  # Radix UI wrappers
│   ├── ai/                  # AI components
│   ├── layout/              # Layout components
│   ├── modals/              # Dialogs & modals
│   └── trip-details/        # Trip features
├── pages/                   # 45+ pages
├── hooks/                   # Custom hooks
├── context/                 # React Context
├── lib/                     # Core libraries
│   ├── ai/                  # AI modules (6 agents)
│   ├── api/                 # API clients
│   └── supabase/            # Supabase utils
├── supabase/functions/server/  # Backend
│   ├── index.tsx            # Main server
│   ├── job-service.ts       # Job queue
│   ├── ai-service.tsx       # AI service
│   └── database-setup.tsx   # DB schema
├── styles/
│   └── globals.css          # Tailwind + tokens
└── docs/                    # Documentation
```

---

## 📊 STATS

```
Components:       200+
Pages:            45+
Routes:           45+
API Endpoints:    25
AI Agents:        6
Lines of Code:    ~50,000+
Files:            500+
```

---

**Document Location:** `/docs/01-foundation/11-TECH-STACK-QUICK-REF.md`  
**Previous Location:** `/docs/TECH-STACK-QUICK-REF.md`  
**Full Details:** See `10-TECH-STACK.md`
