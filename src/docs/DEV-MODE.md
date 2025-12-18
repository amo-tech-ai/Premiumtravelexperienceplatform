# Development Mode Configuration

**Status:** ✅ Active  
**Purpose:** Bypass authentication during development for faster iteration

---

## 🔧 What's Currently Disabled

### **1. Authentication** 
**Files Modified:**
- `/components/auth/ProtectedRoute.tsx`
- `/context/AuthContext.tsx`

**Changes:**
- `DEV_MODE = true` flag added
- Mock user automatically logged in
- Protected routes allow all access

**Mock User Data:**
```typescript
{
  id: 'dev-user-123',
  email: 'dev@localscout.com',
  full_name: 'Dev User',
  subscription_tier: 'concierge'
}
```

### **2. Trip Data**
**Files Modified:**
- `/context/TripContext.tsx`

**Changes:**
- `DEV_MODE = true` flag added
- Mock trip data loaded automatically
- No API calls made

**Mock Trip Data:**
```typescript
{
  id: 'trip-123',
  title: 'Medellín Adventure',
  destination_city: 'Medellín',
  destination_country: 'Colombia',
  start_date: '2025-02-15',
  end_date: '2025-02-22',
  total_budget: 2000,
  currency: 'USD',
  status: 'planning'
}
```

---

## ✅ What Works in Dev Mode

1. ✅ **Navigate to any protected route** without login
2. ✅ **Access user data** via `useAuth()` hook
3. ✅ **Access trip data** via `useTrip()` hook
4. ✅ **Test all UI screens** without backend
5. ✅ **Develop features** independently

---

## 🔄 How to Re-Enable Authentication

When ready to integrate Supabase:

### **Step 1: Disable Dev Mode**

**File:** `/components/auth/ProtectedRoute.tsx`
```typescript
// Change this line:
const DEV_MODE = true;

// To this:
const DEV_MODE = false;
```

**File:** `/context/AuthContext.tsx`
```typescript
// Change this line:
const DEV_MODE = true;

// To this:
const DEV_MODE = false;
```

**File:** `/context/TripContext.tsx`
```typescript
// Change this line:
const DEV_MODE = true;

// To this:
const DEV_MODE = false;
```

### **Step 2: Connect Supabase**

1. Create Supabase project
2. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
3. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

### **Step 3: Replace API Calls**

Search for `// TODO: Replace with Supabase` comments in:
- `/context/AuthContext.tsx` - Replace fetch() with Supabase auth
- `/context/TripContext.tsx` - Replace fetch() with Supabase queries

---

## 🧪 Testing with Dev Mode

### **Test Protected Routes:**
```
Navigate to: /trip/trip-123
Expected: See "Medellín Adventure" trip dashboard
```

### **Test User Context:**
```typescript
const { user } = useAuth();
console.log(user); // Shows mock user
```

### **Test Trip Context:**
```typescript
const { currentTrip } = useTrip();
console.log(currentTrip); // Shows mock trip
```

---

## 📋 Dev Mode Checklist

- [x] Auth disabled
- [x] Mock user loaded
- [x] Mock trip loaded
- [x] Protected routes accessible
- [x] No API calls failing
- [x] Console errors cleared

---

## ⚠️ Important Notes

1. **Don't commit with DEV_MODE = true** to production
2. **Add environment check** later:
   ```typescript
   const DEV_MODE = import.meta.env.DEV;
   ```
3. **All TODO comments** mark where real API integration needed
4. **Mock data** should match production schema exactly

---

## 🚀 Quick Toggle

Create a feature flag file later for easier switching:

```typescript
// /config/feature-flags.ts
export const featureFlags = {
  devMode: import.meta.env.DEV,
  mockAuth: import.meta.env.DEV,
  mockData: import.meta.env.DEV,
};
```

---

**Last Updated:** December 18, 2025  
**Author:** Development Team  
**Status:** Active during development
