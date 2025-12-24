# PHASE 5: AUTHENTICATION SYSTEM
## Supabase Auth + Protected Routes + Session Management

**Document:** 06-phase-5-authentication.md  
**Phase:** 5 of 11  
**Duration:** 60-90 minutes  
**Prerequisites:** Phase 4 complete, Supabase project created  
**Status:** Ready to Execute

---

## PHASE OBJECTIVE

Integrate Supabase authentication with email/password and OAuth providers, implement protected route guards, create login and signup pages, and manage user sessions across the application.

---

## SUCCESS CRITERIA

- Supabase client initialized and configured
- Email/password signup and login working
- OAuth providers configured (Google, GitHub)
- Protected routes redirect unauthenticated users
- User session persists across page refreshes
- Logout functionality working
- Auth context provides user state globally
- Password reset flow implemented

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Create Supabase Project

**Action:** Set up Supabase project for backend services  

**Supabase Dashboard:**  
Navigate to supabase.com and sign in. Click "New Project" button. Choose organization or create new one. Enter project name: "i-love-medellin". Choose database password (save securely). Select region closest to target users. Wait for project provisioning (2-3 minutes).  

**Project Settings:**  
Navigate to project settings. Copy Project URL (will be VITE_SUPABASE_URL). Navigate to API settings. Copy anon/public key (will be VITE_SUPABASE_ANON_KEY).  

**Verification:** Supabase project active, URL and key copied

### Step 2: Configure Environment Variables

**Action:** Add Supabase credentials to project  

**File - .env.local:**  
Add VITE_SUPABASE_URL with your project URL. Add VITE_SUPABASE_ANON_KEY with your anon key. These values are safe for client-side use (anon key is public).  

**File - .env.example:**  
Update with variable names and placeholder values. Add comments explaining where to find real values. Keep as template for other developers.  

**Verification:** Environment variables set, app can access via import.meta.env

### Step 3: Install Supabase Client

**Action:** Add Supabase JavaScript client library  

**Installation:**  
Run npm install @supabase/supabase-js. This provides client for interacting with Supabase services.  

**Version:**  
Ensure version 2.0 or higher for latest Auth features.  

**Verification:** Package in package.json, importable

### Step 4: Initialize Supabase Client

**Action:** Create Supabase client singleton  

**File - src/lib/supabase/client.ts:**  
Import createClient from @supabase/supabase-js. Read VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from import.meta.env. Create client using createClient function with URL and key. Export client as default.  

**Configuration:**  
Pass options object with auth persistence config. Set persistSession to true. Set storage to localStorage for session persistence.  

**Validation:**  
Add runtime check that environment variables exist. Throw clear error if missing. This prevents silent failures.  

**Verification:** Client file created, exports Supabase client instance

### Step 5: Create Auth Context

**Action:** Build React context for auth state  

**File - src/features/auth/AuthContext.tsx:**  
Create context with TypeScript interface for auth state. Interface includes user object (or null), loading boolean, signIn function, signUp function, signOut function. Create provider component managing auth state. Use useState for user and loading. Export useAuth hook for consuming context.  

**Context Value:**  
user: User object from Supabase or null. loading: boolean for initial auth check. signIn: async function accepting email and password. signUp: async function for registration. signOut: async function to clear session.  

**Verification:** Context created with proper TypeScript types

### Step 6: Implement Auth State Listener

**Action:** Listen for Supabase auth state changes  

**File - src/features/auth/AuthContext.tsx:**  
In provider component, add useEffect hook. Call supabase.auth.onAuthStateChange listener. Listener receives event and session objects. On SIGNED_IN event, set user from session. On SIGNED_OUT event, set user to null. On INITIAL_SESSION, set user if session exists. Return cleanup function unsubscribing listener.  

**Initial Session Check:**  
On mount, call supabase.auth.getSession to check existing session. Set user if valid session found. Set loading to false after check.  

**Verification:** Auth state updates when user logs in or out

### Step 7: Implement Sign Up Function

**Action:** Create user registration with email/password  

**File - src/features/auth/AuthContext.tsx:**  
Implement signUp function in provider. Accept email, password, and optional user metadata. Call supabase.auth.signUp with credentials. Handle response: success sets user, error throws or returns error. Add email confirmation handling (Supabase sends confirmation email by default).  

**Error Handling:**  
Catch and format Supabase errors. Common errors: email already exists, weak password, invalid email format. Return user-friendly error messages.  

**Verification:** Sign up function defined and callable

### Step 8: Implement Sign In Function

**Action:** Create user login with email/password  

**File - src/features/auth/AuthContext.tsx:**  
Implement signIn function in provider. Accept email and password. Call supabase.auth.signInWithPassword with credentials. Handle response: success sets session, error throws or returns error. Session automatically persisted by Supabase client.  

**Error Handling:**  
Common errors: invalid credentials, email not confirmed, user not found. Return clear error messages for each case.  

**Verification:** Sign in function defined and callable

### Step 9: Implement Sign Out Function

**Action:** Create logout functionality  

**File - src/features/auth/AuthContext.tsx:**  
Implement signOut function in provider. Call supabase.auth.signOut to clear session. Set user to null in context. Clear any local state related to user. Redirect to login page or homepage.  

**Cleanup:**  
Clear localStorage items specific to user. Reset any global state tied to user session.  

**Verification:** Sign out function clears session and state

### Step 10: Wrap App with Auth Provider

**Action:** Make auth context available globally  

**File - src/App.tsx:**  
Import AuthProvider from features/auth. Wrap entire app (RouterProvider) with AuthProvider. This makes auth context available to all components via useAuth hook.  

**Provider Order:**  
AuthProvider should be outer-most or near outer-most. Any provider needing auth data should be inside AuthProvider.  

**Verification:** App wrapped, useAuth accessible in components

### Step 11: Create Protected Route Component

**Action:** Build guard component for authenticated routes  

**File - src/app/guards/ProtectedRoute.tsx:**  
Create component accepting children prop. Use useAuth hook to get user and loading state. If loading, show loading spinner. If no user, redirect to /login using Navigate from react-router-dom. Add return URL as search param. If user exists, render children.  

**Return URL Handling:**  
Capture current location. Pass as returnUrl query param to login. After login, redirect back to attempted route.  

**Verification:** Protected route component created

### Step 12: Apply Protected Route to App Routes

**Action:** Secure authenticated route groups  

**File - src/routes/app.ts:**  
Import ProtectedRoute component. Wrap app route element with ProtectedRoute. All nested routes will require authentication. User without session redirected to login.  

**Alternative Approach:**  
Use route loader to check auth and redirect. Loader checks session, throws redirect response if not authenticated. Both patterns valid, choose one.  

**Verification:** Visiting /app routes when logged out redirects to /login

### Step 13: Build Login Page

**Action:** Create login form with email and password  

**File - src/pages/auth/LoginPage.tsx:**  
Create form with email input, password input, submit button. Use controlled components with useState for form values. On submit, call signIn from useAuth context. Handle loading state (disable form, show spinner). Display error messages below form. Include link to signup page. Include "Forgot Password" link. Add OAuth buttons (will implement next step).  

**Form Validation:**  
Validate email format before submission. Require password field not empty. Show field-level errors.  

**Success Handling:**  
On successful login, check for returnUrl param. Redirect to returnUrl or default to /app. Show success message briefly.  

**Verification:** Login page renders with working form

### Step 14: Build Signup Page

**Action:** Create registration form  

**File - src/pages/auth/SignupPage.tsx:**  
Create form with name input (for metadata), email input, password input, confirm password input, submit button. On submit, call signUp from useAuth context. Validate password match. Validate password strength (min 8 chars, mix of letters and numbers). Show success message about confirmation email. Redirect to login or confirmation page.  

**Terms Acceptance:**  
Include checkbox for accepting terms of service. Link to /terms and /privacy pages. Require acceptance before allowing signup.  

**Verification:** Signup page renders with working form

### Step 15: Configure OAuth Providers

**Action:** Set up Google and GitHub authentication  

**Supabase Dashboard:**  
Navigate to Authentication > Providers. Enable Google provider. Add OAuth client ID and secret from Google Cloud Console. Set redirect URL to Supabase auth callback. Enable GitHub provider. Add OAuth app credentials from GitHub settings. Set redirect URL.  

**Google Setup:**  
Create OAuth 2.0 credentials in Google Cloud Console. Add authorized redirect URIs from Supabase. Copy client ID and secret to Supabase settings.  

**GitHub Setup:**  
Create OAuth app in GitHub developer settings. Add callback URL from Supabase. Copy client ID and secret to Supabase.  

**Verification:** Providers enabled in Supabase dashboard

### Step 16: Add OAuth Login Buttons

**Action:** Implement social login on login page  

**File - src/pages/auth/LoginPage.tsx:**  
Add function signInWithGoogle calling supabase.auth.signInWithOAuth with provider 'google'. Add button "Continue with Google" triggering function. Add function signInWithGithub with provider 'github'. Add button "Continue with GitHub". Include provider icons using lucide-react.  

**OAuth Flow:**  
Button click redirects to provider login. User authenticates with provider. Provider redirects back to app callback URL. Callback handler processes auth and redirects to app.  

**Verification:** OAuth buttons redirect to provider login pages

### Step 17: Create Auth Callback Handler

**Action:** Handle OAuth redirects from providers  

**File - src/pages/auth/AuthCallbackPage.tsx:**  
Create page component that Supabase redirects to after OAuth. Use useEffect to check for session after redirect. If session exists, redirect to /app or returnUrl. If error in URL params, display error message. Show loading spinner while processing.  

**Route Configuration:**  
Ensure /auth/callback route renders this page. This is the redirect URL configured in Supabase.  

**Verification:** OAuth login flow completes and redirects to app

### Step 18: Build Password Reset Flow

**Action:** Allow users to reset forgotten passwords  

**File - src/pages/auth/ResetPasswordPage.tsx:**  
Create page with email input form. On submit, call supabase.auth.resetPasswordForEmail with email. Show success message: "Check your email for reset link". Supabase sends email with reset link. Link directs to app with token in URL. Detect token, show password reset form. Allow user to enter new password. Call supabase.auth.updateUser to set new password.  

**Two-Step Process:**  
Step 1: Request reset (email input). Step 2: Set new password (token in URL, new password input).  

**Verification:** Reset flow sends email, allows setting new password

### Step 19: Add User Menu with Logout

**Action:** Update user menu component with auth actions  

**File - src/components/shared/UserMenu.tsx:**  
Import useAuth hook. Display user email or name in menu. Add logout button calling signOut function. On logout, redirect to homepage. Show loading state during logout.  

**User Display:**  
Show user avatar (use Supabase storage or Gravatar). Show user name from metadata if available. Fallback to email if no name.  

**Verification:** User menu shows current user, logout button works

### Step 20: Test Complete Auth Flow

**Action:** Verify entire authentication system  

**Testing Checklist:**  
Sign up new user with email/password. Check email for confirmation link (if email confirmation enabled). Click confirmation link. Log in with same credentials. Verify redirected to /app. Navigate to protected route, verify accessible. Log out. Verify redirected to homepage and session cleared. Attempt to access /app while logged out, verify redirected to login. Log in with Google OAuth. Verify successful login. Test password reset flow. Test returnUrl after login.  

**Verification:** All auth flows working without errors

---

## VALIDATION CHECKLIST

### Supabase Setup

- [ ] Supabase project created
- [ ] Project URL copied to .env.local
- [ ] Anon key copied to .env.local
- [ ] Environment variables accessible in code
- [ ] Supabase client initialized

### Auth Context

- [ ] AuthContext created with TypeScript types
- [ ] AuthProvider component implemented
- [ ] useAuth hook exported
- [ ] App wrapped with AuthProvider
- [ ] Auth state listener implemented
- [ ] signUp function implemented
- [ ] signIn function implemented
- [ ] signOut function implemented

### Protected Routes

- [ ] ProtectedRoute component created
- [ ] Component checks auth state
- [ ] Redirects to /login when not authenticated
- [ ] Passes returnUrl parameter
- [ ] App routes wrapped with ProtectedRoute

### Login & Signup Pages

- [ ] LoginPage created with form
- [ ] Email and password validation
- [ ] Error messages displayed
- [ ] Forgot password link present
- [ ] SignupPage created with form
- [ ] Password confirmation field
- [ ] Terms acceptance checkbox
- [ ] Success messaging

### OAuth Integration

- [ ] Google provider enabled in Supabase
- [ ] GitHub provider enabled in Supabase
- [ ] OAuth buttons on login page
- [ ] Auth callback route configured
- [ ] AuthCallbackPage handles redirects
- [ ] OAuth flow completes successfully

### Password Reset

- [ ] ResetPasswordPage created
- [ ] Email form for requesting reset
- [ ] Password reset email sends
- [ ] New password form on token detection
- [ ] Password update function works

### User Interface

- [ ] UserMenu shows current user
- [ ] Logout button in UserMenu
- [ ] User avatar displays
- [ ] Auth loading states shown
- [ ] Error states handled gracefully

### Functionality Tests

- [ ] Sign up with email/password works
- [ ] Email confirmation (if enabled) works
- [ ] Sign in with email/password works
- [ ] Sign in with Google works
- [ ] Sign in with GitHub works
- [ ] Sign out clears session
- [ ] Session persists on page refresh
- [ ] Protected routes redirect when not authenticated
- [ ] Return URL works after login
- [ ] Password reset flow completes

---

## TROUBLESHOOTING

### Issue: Environment Variables Undefined

**Symptom:** import.meta.env.VITE_SUPABASE_URL is undefined  
**Cause:** .env.local not created or variables not prefixed with VITE_  
**Solution:** Ensure .env.local exists in project root. Verify variables start with VITE_ prefix. Restart dev server after changing env files.

### Issue: Auth State Not Updating

**Symptom:** User logs in but useAuth still shows null user  
**Cause:** Auth listener not set up or context not wrapping app  
**Solution:** Verify onAuthStateChange listener in AuthProvider. Ensure AuthProvider wraps RouterProvider in App.tsx. Check that useAuth called inside provider tree.

### Issue: Protected Routes Not Redirecting

**Symptom:** Unauthenticated users can access /app routes  
**Cause:** ProtectedRoute not applied or checking wrong state  
**Solution:** Verify ProtectedRoute wraps app routes in route config. Check that component uses useAuth hook correctly. Ensure Navigate component from react-router-dom used for redirect.

### Issue: OAuth Redirect Fails

**Symptom:** After provider login, redirected to error page  
**Cause:** Callback URL mismatch or provider not configured  
**Solution:** Verify callback URL in Supabase matches /auth/callback route. Check OAuth credentials in Supabase dashboard are correct. Ensure providers enabled. Check browser console for specific error.

### Issue: Session Not Persisting

**Symptom:** User logged out on page refresh  
**Cause:** Persistence not enabled or localStorage blocked  
**Solution:** Verify Supabase client created with persistSession: true option. Check browser allows localStorage (not in incognito with restrictions). Verify no errors in console related to storage.

---

## NEXT PHASE PREVIEW

**Phase 6:** Build Trips module with trip list, trip detail, and drag-and-drop itinerary builder. Implement trip CRUD operations with Supabase. Create wizard for new trip creation.

**What You'll Need:** Auth system complete and tested. Understanding of Supabase database and Row Level Security. Familiarity with drag-and-drop libraries.

**Estimated Time:** 120-150 minutes

---

**Phase Status:** ✅ Ready to Execute  
**Last Updated:** December 24, 2024  
**Dependencies:** Phase 4 (marketing pages for redirect)  
**Blocks:** Phase 6 (trips module needs auth to associate trips with users)
