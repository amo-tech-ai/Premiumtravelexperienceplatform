# 11 - Authentication & Onboarding Implementation Plan

**Feature:** User Signup, Login, Onboarding Wizard  
**Priority:** Critical (Phase 2 - Week 1, parallel to Supabase setup)  
**Owner:** Frontend Team + Backend Team  
**Stack:** Supabase Auth, React Hook Form, Multi-step wizard

---

## Progress Tracker

| Phase | Task | Status | Owner | Validation |
|-------|------|--------|-------|-----------|
| **Design** | Login and signup forms | 🔴 Not Started | Figma Make | Forms accessible, mobile-friendly |
| **Backend** | Supabase Auth integration | 🔴 Not Started | Cursor AI | JWT tokens work correctly |
| **Frontend** | Onboarding wizard (5 steps) | 🔴 Not Started | Figma + Cursor | 80% completion rate |
| **UX** | Password reset flow | 🔴 Not Started | Cursor AI | Email sent successfully |
| **Testing** | Auth edge cases | 🔴 Not Started | QA | Expired tokens handled |

---

## 1. Product Goal

**Problem:** Users can't create accounts, no personalization, everyone sees same generic experience.

**Solution:** Seamless signup with social OAuth, progressive onboarding wizard that captures preferences without overwhelming users.

**Outcome:** Users feel app is personalized from Day 1, onboarding completion rate 80%+.

**Success Metric:** 80% signup completion, 90% onboarding completion, zero authentication errors.

---

## 2. Authentication Flows

### Flow 1: Email/Password Signup

**Steps:**
1. User clicks "Get Started" on homepage
2. Signup form: email, password, confirm password
3. Client-side validation: email format, password strength (8+ chars, 1 number)
4. Call Supabase Auth: `supabase.auth.signUp(email, password)`
5. Database trigger creates `users` table record (from Doc 04)
6. Redirect to onboarding wizard
7. Skip email verification for MVP (enable later for production)

**Supabase Auth Config:**
- Enable email provider in Supabase dashboard
- Set redirect URL: `https://localscout.app/onboarding`
- Disable email confirmation for MVP (set `confirm_email: false`)

---

### Flow 2: Social OAuth (Google)

**Steps:**
1. User clicks "Continue with Google"
2. Supabase Auth redirects to Google consent screen
3. User approves, Google returns OAuth token
4. Supabase exchanges token for session
5. Database trigger creates `users` record with Google profile data
6. Check if `onboarding_completed` is false
7. If false: redirect to onboarding wizard
8. If true: redirect to dashboard

**Supabase OAuth Config:**
- Enable Google provider in Supabase dashboard
- Add OAuth client ID and secret (from Google Cloud Console)
- Set authorized redirect URI: `https://[project-id].supabase.co/auth/v1/callback`

---

### Flow 3: Login (Returning Users)

**Steps:**
1. User clicks "Log In" button
2. Login form: email, password
3. Call Supabase Auth: `supabase.auth.signInWithPassword(email, password)`
4. On success: store session in localStorage (automatic via Supabase client)
5. Fetch user profile from `users` table
6. Redirect to dashboard
7. Protected routes now accessible

**Error Handling:**
- Invalid credentials: show "Email or password incorrect"
- Account doesn't exist: show "No account found - Sign up?"
- Too many attempts: show "Too many login attempts, try again in 5 minutes"

---

### Flow 4: Password Reset

**Steps:**
1. User clicks "Forgot password?" on login form
2. Reset form: enter email
3. Call Supabase Auth: `supabase.auth.resetPasswordForEmail(email)`
4. Supabase sends password reset email with magic link
5. User clicks link, redirected to reset password page
6. New password form: password, confirm password
7. Call Supabase Auth: `supabase.auth.updateUser({ password: newPassword })`
8. Success message: "Password updated - log in with new password"

---

## 3. Onboarding Wizard (5 Steps)

### Step 1: Welcome & Name

**Purpose:** Capture basic profile info

**Fields:**
- Full name (text input)
- Profile photo (optional, upload or skip)

**Design:**
- Large heading: "Welcome to Local Scout!"
- Subheading: "Let's personalize your experience"
- Progress indicator: 1 of 5 steps
- Primary CTA: "Continue"
- Secondary: "Skip for now"

---

### Step 2: Travel Preferences

**Purpose:** Understand travel style for AI personalization

**Fields:**
- Travel pace: Relaxed / Moderate / Fast-paced (radio buttons)
- Budget level: Budget / Mid-range / Luxury (radio buttons)
- Interests: Culture, Food, Nightlife, Nature, Adventure (multi-select checkboxes)

**AI Usage:**
- Stored in `user_preferences` table (Doc 04)
- Used by Dining Orchestrator (Doc 03) for restaurant matching
- Used by Itinerary Optimizer (Doc 01) for activity selection

---

### Step 3: Dietary Restrictions

**Purpose:** Ensure safe dining recommendations

**Fields:**
- Dietary preferences: Vegetarian / Vegan / Pescatarian / None (radio)
- Allergies: Gluten, Dairy, Nuts, Shellfish, Soy (multi-select)
- Custom allergies: text input

**Critical for:**
- Dining Orchestrator (Doc 03) filters restaurants
- Menu parsing excludes unsafe dishes
- Budget Guardian (Doc 05) considers dietary costs

---

### Step 4: First Trip Setup

**Purpose:** Create initial trip to show immediate value

**Fields:**
- Destination: text input with autocomplete (Google Places API)
- Dates: date range picker
- Trip type: Solo / Couple / Family / Friends (radio)
- Budget: numeric input (optional)

**Backend:**
- Creates `trips` table record
- Creates `itinerary_days` records based on date range
- Triggers Local Scout (Doc 02) event discovery in background

---

### Step 5: Enable Notifications

**Purpose:** Allow push notifications for price drops, booking reminders

**Fields:**
- Push notifications: toggle (default off)
- Email notifications: toggle (default on)

**Implementation:**
- Request browser notification permission (Web Push API)
- Store FCM token in `users` table (for future push notifications)
- Set notification preferences in user profile

**Skip Option:**
- "I'll set this up later" link
- Still creates account, completes onboarding

---

## 4. Protected Routes Implementation

### Route Protection Logic

**Unprotected Routes (Public):**
- `/` (homepage)
- `/how-it-works`
- `/login`
- `/signup`
- `/reset-password`

**Protected Routes (Require Auth):**
- `/dashboard`
- `/trip/:id`
- `/saved`
- `/chats`
- `/profile`

**Implementation:**
```
Create ProtectedRoute component
Check if user session exists: supabase.auth.getSession()
If no session: redirect to /login with return_to parameter
If session exists: render requested component
Handle token refresh automatically (Supabase client does this)
```

---

## 5. Supabase Auth Helpers

### Helper Functions (Create in /utils/auth.ts)

**Function 1: getCurrentUser**
- Returns current user object or null
- Checks localStorage for session
- Validates token expiry

**Function 2: signOut**
- Calls Supabase Auth signOut
- Clears localStorage session
- Redirects to homepage

**Function 3: requireAuth**
- Used in protected routes
- Throws error if no session
- Returns user object if authenticated

**Function 4: isOnboardingComplete**
- Queries `users` table for `onboarding_completed` field
- Returns boolean
- Used to redirect incomplete users to wizard

---

## 6. Implementation Prompts

### Figma Make Prompts

**Prompt 1: Design Login/Signup Forms**
"Create authentication screens. Login form: email input, password input (with show/hide toggle), 'Forgot password?' link, 'Log In' button (primary), 'Continue with Google' button (with Google logo), 'Don't have account? Sign Up' link. Signup form: email, password, confirm password, agree to terms checkbox, 'Create Account' button, 'Or continue with Google' button. Use emerald primary color, clean luxury aesthetic, mobile-friendly (stack inputs vertically on mobile)."

**Prompt 2: Design Onboarding Wizard**
"Create 5-step onboarding wizard. Progress bar at top showing current step. Each step: heading, description, form fields, 'Continue' primary button, 'Skip' ghost button (except final step). Step 1: name input, profile photo uploader. Step 2: travel pace radio buttons (icons for relaxed/moderate/fast), budget level radio, interests checkboxes with icons. Step 3: dietary preferences radio, allergy checkboxes. Step 4: destination autocomplete, date range picker, trip type radio, budget input. Step 5: notification toggles with explanations. Final step button: 'Start Planning'."

### Cursor AI Prompts

**Prompt 3: Integrate Supabase Auth**
"Create authentication system using Supabase Auth. In /utils/auth.ts: implement getCurrentUser (returns user or null), signUp (email, password), signIn (email, password), signOut, resetPassword functions. Each function calls corresponding Supabase Auth method. Handle errors: invalid credentials, network failures, expired tokens. Store session automatically (Supabase client handles). Create AuthContext to provide auth state globally (user, loading, error). Subscribe to auth state changes via supabase.auth.onAuthStateChange."

**Prompt 4: Build Protected Route Component**
"Create ProtectedRoute wrapper component. Props: children (React element). Logic: call getCurrentUser, if null redirect to /login with return_to query param (so user returns after login). If user exists but onboarding_completed false, redirect to /onboarding. If user authenticated and onboarded, render children. Show loading spinner while checking session. Handle token refresh automatically (Supabase client does this). Use in App.tsx to wrap protected routes like /dashboard, /trip/:id."

**Prompt 5: Implement Onboarding Wizard**
"Create multi-step onboarding wizard using React Hook Form. Component: OnboardingWizard with 5 steps. State: currentStep (1-5), formData object. Step 1: capture full_name, avatar_url (optional file upload to Supabase Storage). Step 2: capture travel preferences (activity_pace, budget_level, interests array). Step 3: capture dietary_restrictions array, allergies array. Step 4: create first trip (call createTrip function), capture destination, start_date, end_date, trip_type, budget_total. Step 5: capture notification preferences. On final step: update users table with onboarding_completed true, redirect to /dashboard."

**Prompt 6: Add Social OAuth (Google)**
"Implement Google OAuth using Supabase Auth. In login/signup pages, add 'Continue with Google' button. onClick: call supabase.auth.signInWithOAuth provider google, redirectTo /onboarding. Configure in Supabase dashboard: enable Google provider, add OAuth credentials from Google Cloud Console. Set redirect URL: https://[project].supabase.co/auth/v1/callback. After successful OAuth, user redirected to /onboarding (if new) or /dashboard (if returning). Database trigger creates users record with Google profile data (email, full_name, avatar_url from Google)."

**Prompt 7: Build Password Reset Flow**
"Implement password reset. Create /reset-password page with email input form. On submit: call supabase.auth.resetPasswordForEmail(email), show success message 'Check your email for reset link'. User clicks link in email, redirected to /update-password page with token in URL. Update password form: new password, confirm password inputs. On submit: call supabase.auth.updateUser password newPassword. Show success message, redirect to /login. Handle errors: invalid token (expired), email not found, weak password (show requirements)."

---

## 7. Database Schema (Add to Doc 04)

**Extend `users` table:**
```
Add columns:
- onboarding_completed (boolean, default false)
- onboarding_step (integer, tracks progress if interrupted)
- oauth_provider (text, null or 'google')
- last_login_at (timestamp)
```

**Create `onboarding_data` table (temporary storage):**
```
- id (uuid)
- user_id (uuid, foreign key to users)
- step_number (integer)
- step_data (jsonb)
- created_at (timestamp)
```

**Purpose:** Store onboarding progress if user closes browser mid-wizard

---

## 8. Real-World Use Cases

**Use Case 1: Quick Signup via Google**
Tourist on phone wants to use app immediately. Clicks "Continue with Google", 2 taps for OAuth consent, lands in onboarding wizard. Completes 5 steps in 90 seconds. First trip auto-created with event suggestions waiting. Total time from homepage to personalized dashboard: 2 minutes.

**Use Case 2: Password Reset from Mobile**
User forgot password, clicks "Forgot password?", enters email, receives reset link. Opens email on phone, clicks link, redirected to app. Enters new password, logs in successfully. Never left mobile device, seamless experience.

**Use Case 3: Incomplete Onboarding Recovery**
User starts onboarding, completes Step 2, closes browser. Returns next day, logs in. System detects `onboarding_completed` is false. Redirects to Step 3 (resumes where left off). User completes remaining steps, no data loss.

---

## 9. Success Criteria

**MVP Launch:**
- 80% signup completion rate (users who start, finish)
- 90% onboarding completion rate (users who reach wizard, finish all 5 steps)
- Zero authentication errors in production (JWT validation works)
- Password reset success rate: 95%+ (email delivered, user completes)

**UX Metrics:**
- Signup form completion time: under 30 seconds
- Onboarding wizard completion time: under 3 minutes
- OAuth signup (Google): under 20 seconds total
- Mobile signup completion rate: 85%+ (not just desktop)

---

## 10. Production Checklist

- [ ] Supabase Auth configured with email and Google providers
- [ ] Email templates customized (welcome email, password reset)
- [ ] Protected routes redirect to login correctly
- [ ] JWT tokens refresh automatically before expiry
- [ ] Onboarding wizard saves progress (recoverable if interrupted)
- [ ] Password reset emails delivered within 2 minutes
- [ ] Social OAuth callback URLs whitelisted in production
- [ ] Rate limiting: max 5 login attempts per email per 15 minutes
- [ ] CAPTCHA added to signup form (prevent bot signups)
- [ ] Accessibility: forms keyboard navigable, screen reader compatible
- [ ] Mobile: forms work on 320px width devices
- [ ] Error messages helpful (not just "Authentication failed")

---

**Reference Docs:**
- See Doc 04 (Backend Integration) for users table schema
- See Doc 09 (Mobile Responsive) for mobile form patterns
- See Doc 10 (Production Deployment) for security best practices

**Document Owner:** Frontend Team + Backend Team  
**Dependencies:** Supabase Auth enabled, Google OAuth credentials, email service configured
