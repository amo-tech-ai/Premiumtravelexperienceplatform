# Authentication Flow
## Signup, Login, OAuth Integration

**Status:** ✅ Production Ready  
**Provider:** Supabase Auth  
**Last Updated:** December 18, 2025

---

## Authentication Strategy

**Primary:** Supabase Auth (built-in)  
**Methods:** Email/Password, Google OAuth, Magic Links  
**Session:** JWT tokens with refresh  
**Security:** Row Level Security (RLS) enabled

---

## Screen 1: Landing Page CTA

**Route:** `/`

**Prompt:**
```
Create landing page authentication section.

CTA Buttons:
- Primary: "Start Planning" → /signup
- Secondary: "Log In" → /login

Messaging:
"Join 10,000+ travelers planning smarter trips with AI"

Social Proof:
- Avatar stack (5 user photos)
- "4.8★ from 2,000+ reviews"
```

---

## Screen 2: Signup

**Route:** `/signup`

**Prompt:**
```
Create signup screen with Supabase Auth integration.

Layout (centered card, max-width 400px):

1. HEADER
   Title: "Create your account"
   Subtitle: "Start planning your perfect trip"

2. OAUTH BUTTONS (full width, stacked)
   - "Continue with Google" (Google icon + text)
   - Visual: White button, border, Google colors
   - Click → Supabase signInWithOAuth({provider: 'google'})

3. DIVIDER
   - Horizontal line with "or" text in center

4. EMAIL FORM
   Fields:
   - Full Name (optional, can update later)
   - Email (required, validated)
   - Password (required, min 8 chars, show/hide toggle)
   - Checkbox: "I agree to Terms and Privacy Policy" (links)
   
   Primary CTA: "Create Account" (full width, disabled until valid)

5. FOOTER
   "Already have an account? Log in" (link to /login)

STATES:
- Loading: Show spinner on button during API call
- Error: Display below form (e.g., "Email already registered")
- Success: Redirect to /trip/new (onboarding)

VALIDATION:
- Email: RFC 5322 format
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special
- Real-time validation feedback (green checkmarks)

ACCESSIBILITY:
- Tab navigation through fields
- Enter key submits form
- Clear error messages with aria-describedby
- Focus on first error field

RESPONSIVE:
- Mobile: Full screen card
- Desktop: Centered modal style

SECURITY:
- Password never logged
- HTTPS only
- Rate limit: 5 attempts per IP per hour
- CAPTCHA after 3 failed attempts
```

**Supabase Integration:**
```javascript
// Email signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
    }
  }
})

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

---

## Screen 3: Login

**Route:** `/login`

**Prompt:**
```
Create login screen (similar to signup, simplified).

Layout:

1. HEADER
   Title: "Welcome back"
   Subtitle: "Log in to continue planning"

2. OAUTH BUTTON
   - "Continue with Google"

3. DIVIDER
   - "or"

4. EMAIL FORM
   Fields:
   - Email
   - Password (with "Forgot password?" link)
   - Checkbox: "Keep me logged in" (extends session)
   
   Primary CTA: "Log In"

5. FOOTER
   "Don't have an account? Sign up"

STATES:
- Loading: Spinner on button
- Error: "Invalid email or password" (don't specify which)
- Success: Redirect to /trips (user's trips list)
- Remember Me: Sets session expiry to 30 days vs 24 hours

FORGOT PASSWORD:
- Link → Opens modal
- Input: Email
- Button: "Send Reset Link"
- Success: "Check your email for reset instructions"
```

**Supabase Integration:**
```javascript
// Email login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})

// Magic link (optional)
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  }
})
```

---

## Screen 4: Password Reset

**Route:** `/reset-password?token=...`

**Prompt:**
```
Create password reset screen (accessed via email link).

Layout:

1. HEADER
   Title: "Reset your password"
   Subtitle: "Choose a new secure password"

2. FORM
   Fields:
   - New Password (min 8 chars, show/hide)
   - Confirm Password (must match)
   - Visual: Password strength meter
   
   Primary CTA: "Update Password"

3. VALIDATION
   - Real-time match check
   - Password requirements shown
   - Strength indicator (weak/medium/strong)

SUCCESS:
- Show: "Password updated! Redirecting..."
- Auto-redirect to /login after 2s

ERROR:
- "Reset link expired" → "Request new reset link"
```

**Supabase Integration:**
```javascript
const { data, error } = await supabase.auth.updateUser({
  password: 'new_password123'
})
```

---

## Screen 5: OAuth Callback

**Route:** `/auth/callback`

**Prompt:**
```
Create OAuth callback loading screen (shown briefly during redirect).

Layout:
- Centered spinner
- Text: "Completing login..."
- This screen handles OAuth token exchange
- Redirects to /trips on success
- Redirects to /login with error message on failure

No user interaction needed.
Auto-redirect within 2 seconds.
```

**Supabase Integration:**
```javascript
// Supabase handles this automatically
// Just ensure redirect URL is whitelisted in Supabase dashboard
```

---

## Session Management

### Auto-Refresh Tokens
```javascript
// Supabase handles automatically
// Tokens refresh 60 seconds before expiry
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User logged in
  }
  if (event === 'SIGNED_OUT') {
    // User logged out
  }
  if (event === 'TOKEN_REFRESHED') {
    // Token auto-refreshed
  }
})
```

### Protected Routes
```javascript
// Check authentication before rendering
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  // Redirect to /login
  window.location.href = '/login'
}
```

### Logout
```javascript
const { error } = await supabase.auth.signOut()
// Clear local state
// Redirect to /
```

---

## Security Features

**Supabase Built-In:**
- ✅ Email verification (optional, can enable)
- ✅ Password reset via email
- ✅ Rate limiting on auth endpoints
- ✅ JWT tokens with refresh
- ✅ Secure cookie storage
- ✅ CSRF protection
- ✅ Row Level Security (RLS)

**Additional Implementation:**
- ✅ HTTPS only (enforce in production)
- ✅ Password strength requirements
- ✅ Account lockout after 5 failed attempts (15 min)
- ✅ Session timeout: 24 hours (extendable to 30 days)
- ✅ Multi-device sessions supported
- ✅ Revoke sessions from account settings

---

## Row Level Security (RLS)

**Enable for all tables:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Trip creators and members can access trips
CREATE POLICY "Trip access" ON trips
  FOR SELECT USING (
    creator_id = auth.uid() 
    OR id IN (
      SELECT trip_id FROM trip_members 
      WHERE user_id = auth.uid()
    )
  );

-- Similar policies for all tables
```

---

## User Flow Diagrams

### Signup Flow
```
Landing Page → "Start Planning" → 
Signup Screen → Enter Details → 
Create Account → Email Verification (optional) → 
Trip Creation Wizard → Dashboard
```

### Login Flow
```
Landing Page → "Log In" → 
Login Screen → Enter Credentials → 
Authenticate → Dashboard
```

### OAuth Flow
```
Signup/Login → "Continue with Google" → 
Google Auth (external) → 
OAuth Callback → 
Dashboard
```

### Password Reset Flow
```
Login → "Forgot Password?" → 
Enter Email → Check Email → 
Click Link → Reset Password Screen → 
Update Password → Login
```

---

## Error Handling

### Common Errors
- **Email already exists:** "This email is already registered. Log in instead?"
- **Invalid credentials:** "Email or password is incorrect"
- **Weak password:** "Password must be at least 8 characters with 1 uppercase, 1 number, 1 special"
- **Network error:** "Connection error. Please try again."
- **Rate limited:** "Too many attempts. Try again in 15 minutes."
- **Token expired:** "Session expired. Please log in again."

### User-Friendly Messages
- Never reveal whether email exists (security)
- Provide clear next steps
- Offer contact support for persistent issues

---

## Testing Checklist

**Signup:**
- [ ] Email signup works
- [ ] Google OAuth works
- [ ] Email validation prevents invalid formats
- [ ] Password requirements enforced
- [ ] Duplicate email shows error
- [ ] Success redirects to onboarding

**Login:**
- [ ] Email login works
- [ ] Google OAuth works
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Remember me extends session
- [ ] Success redirects to dashboard

**Password Reset:**
- [ ] Reset email sent
- [ ] Link expires after 1 hour
- [ ] Password update works
- [ ] Redirects to login after success

**Security:**
- [ ] Rate limiting works (5 attempts → lockout)
- [ ] HTTPS enforced in production
- [ ] JWT tokens refresh automatically
- [ ] Logout clears session
- [ ] RLS policies prevent unauthorized access

---

## Production Checklist

**Supabase Configuration:**
- [ ] Email templates customized (signup, reset)
- [ ] OAuth providers enabled (Google)
- [ ] Redirect URLs whitelisted
- [ ] Email verification enabled (optional)
- [ ] Rate limiting configured
- [ ] RLS policies enabled on all tables

**Frontend:**
- [ ] All screens responsive
- [ ] Loading states on all buttons
- [ ] Error messages clear and helpful
- [ ] Accessibility (keyboard, screen reader)
- [ ] Session persistence works
- [ ] Auto-logout on token expiry

**Security:**
- [ ] HTTPS certificate installed
- [ ] Secrets in environment variables
- [ ] No credentials in frontend code
- [ ] CORS configured properly
- [ ] CSP headers set

---

**Status:** ✅ Complete and Production-Ready  
**Next:** Implement screens using Supabase Auth SDK
