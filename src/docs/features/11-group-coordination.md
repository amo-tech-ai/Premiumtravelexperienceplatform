# Group Coordination Feature
## Multi-Traveler Trip Management

**Priority:** MEDIUM-HIGH  
**Revenue Impact:** HIGH  
**Timeline:** Phase 1.5 (Enhancement)  
**Status:** Specification Complete

---

## Overview

**Purpose:** Enable multiple travelers to plan, decide, and pay for group trips collaboratively.

**Key Value:**
- 3.2x higher booking value per group trip vs. solo
- Eliminates coordination chaos (3+ hours saved per trip)
- Democratic decision-making with AI facilitation
- Transparent expense tracking and settlement

---

## Core Features

### 1. **Group Management**
- Add/remove trip members
- Role-based permissions (organizer, co-organizer, member, viewer)
- Individual budget tracking
- Member notifications

### 2. **Decision Polling**
- Ranked-choice voting for activities/restaurants
- AI-generated polls based on group preferences
- Automatic winner selection
- Consensus detection (skip poll if implicit agreement)

### 3. **Expense Splitting**
- Shared vs. individual expenses
- Automatic bill splitting
- Payment requests (Venmo, PayPal, Nequi)
- Settlement tracking (who owes whom)

### 4. **Group AI Preferences**
- Synthesize all member preferences
- Find activities that work for everyone
- Flag conflicts (dietary, budget, interests)
- Suggest compromises

---

## Multi-Step Prompt Chain

### STEP 1: Group Management Screen

```
Create group management for multi-traveler trips.

Route: /trip/:tripId/members

Context: Trip has 4 members - Alex (organizer), Jamie, Sam, Taylor

Build:

1. HEADER
Title: "Trip Members (4)"
Primary CTA: "+ Invite Member" (opens invite modal)

2. MEMBER LIST
Each member card shows:
- Avatar + Name: "Alex Chen"
- Role badge: "Organizer" (green) | "Co-Organizer" (blue) | "Member" (gray)
- Budget: "$600 / $800 spent" (progress bar)
- Status: "Active" or "Pending invitation"
- Actions dropdown (if organizer):
  • Change role
  • Remove from trip
  • View activity

Member Card Layout:
- Left: Avatar (48px circle)
- Center: Name, role, budget progress
- Right: Spent amount + actions (3-dot menu)

3. INVITE MODAL (triggered by "+ Invite Member")
Title: "Invite traveler"
Fields:
- Email (required)
- Role selector: Member (default) | Co-Organizer
- Personal message (optional): "Hey Jamie, let's plan this together!"
Primary CTA: "Send Invitation"

On send:
- Creates pending trip_member record
- Sends email with invite link
- Shows toast: "Invitation sent to jamie@email.com"

4. PERMISSIONS MATRIX (Info section)
Table shows what each role can do:

| Action | Organizer | Co-Organizer | Member | Viewer |
|--------|-----------|--------------|--------|--------|
| Delete trip | ✅ | ❌ | ❌ | ❌ |
| Edit trip details | ✅ | ✅ | ❌ | ❌ |
| Add activities | ✅ | ✅ | ✅ | ❌ |
| Book items | ✅ | ✅ | ✅ | ❌ |
| View expenses | ✅ | ✅ | ✅ | ✅ |
| Invite members | ✅ | ✅ | ❌ | ❌ |

5. STATES
Empty: "You're the only member. Invite friends to plan together!"
Pending invites: Show "Pending" badges with "Resend invite" option
Removed member: Show confirmation modal "Remove Sam from trip?"

Make group management feel collaborative, not hierarchical.
```

---

### STEP 2: Polling System

```
Create AI-powered group polling for decisions.

Route: Modal overlay on /trip/:tripId/dining (or any category)

Context: Organizer wants group to decide on Friday dinner

Build:

1. TRIGGER
When organizer viewing options (e.g., 3 restaurant picks):
- Button: "🗳️ Poll the Group" (secondary CTA)
- On click: Opens poll creation modal

2. POLL CREATION MODAL
Title: "Create Poll"
Subtitle: "Let the group vote on Friday dinner"

Poll Options (auto-populated):
- Option 1: Carmen Restaurant (with image)
- Option 2: El Cielo (with image)
- Option 3: Mondongo's (with image)
- "+ Add Option" (can add more manually)

Voting Type:
- Radio buttons: 
  • Simple Vote (one choice) - default
  • Ranked Choice (rank 1-2-3)
  • Star Rating (rate each 1-5)

Deadline:
- Dropdown: 4 hours | 8 hours | 24 hours | Custom
- Default: 8 hours

Message to Group (optional):
- Text area: "Where should we eat Friday night? Vote by 6 PM!"

Primary CTA: "Send Poll"

3. POLL NOTIFICATION
All members receive:
- Push notification: "Alex created a poll: Friday dinner"
- Email: With poll preview and "Vote Now" button
- In-app: Badge on trip icon

4. VOTING SCREEN
Route: /trip/:tripId/polls/:pollId

Title: "Friday Dinner Vote"
Created by: "Alex" (avatar)
Deadline: "6 hours remaining" (countdown)
Responses: "2/4 voted" (progress)

Options (Ranked Choice example):
Each option shows:
- Restaurant image + name
- Key details: "$50 avg, ⭐ 4.8, Vegetarian options ✓"
- Drag handle (for ranked choice)

Instructions: "Drag to rank your preferences (1 = favorite)"

User Actions:
1. Drag cards to order 1-2-3
2. Tap "Submit Vote" (primary CTA)
3. See confirmation: "Vote recorded! ✅"
4. Show current standings (if organizer allows):
   - Carmen: 6 points (2 first-place, 1 second-place)
   - El Cielo: 5 points
   - Mondongo's: 4 points

5. POLL RESULTS (After deadline or all voted)
Title: "Poll Closed - Winner: Carmen 🎉"

Results breakdown:
- Carmen: 6 points
  • Alex: #2
  • Jamie: #1
  • Sam: #1
  • Taylor: #3
- El Cielo: 5 points
- Mondongo's: 4 points

Visual: Horizontal bar chart showing point distribution

Action: "Book Carmen" (auto-fills reservation form)

6. CONSENSUS DETECTION
If organizer creates poll but AI detects implicit agreement:
- Modal: "💡 Smart Suggestion"
- "I noticed everyone already liked Carmen in the chat. Skip the poll and book it?"
- Actions: "Yes, book Carmen" | "No, still poll the group"

7. STATES
No responses: "Waiting for votes... 0/4"
Partial: "2/4 voted. Waiting for Sam and Taylor."
Tied: "It's a tie! Organizer breaks the tie." → Organizer picks winner
Expired: "Poll closed. Only 2/4 voted. Not enough for decision."

Make polling feel lightweight, not bureaucratic.
```

---

### STEP 3: Expense Splitting & Settlement

```
Create group expense tracking and settlement system.

Route: /trip/:tripId/expenses

Context: 4-person bachelor party, shared and individual expenses

Build:

1. EXPENSE OVERVIEW
Title: "Group Expenses"

Summary Cards (3 cards, horizontal on desktop):
A. TOTAL SPENT
   - "$1,247 total group spending"
   - Breakdown: Shared $800 | Individual $447

B. YOUR SHARE
   - "$312 per person (shared expenses)"
   - "+$87 individual expenses"
   - "= $399 total for you"

C. SETTLEMENT
   - "You owe Alex: $150"
   - "Sam owes you: $0"
   - CTA: "Settle Up"

2. EXPENSE FEED (Grouped by category)
Tabs: All | Shared | My Expenses | Pending Settlement

Each expense card:
- Icon (🏨 hotel, 🍽️ dining, 🎫 event)
- Title: "Hotel Poblado Plaza"
- Amount: "$600 (shared)"
- Split: "4 ways = $150 each"
- Paid by: Alex (avatar)
- Status: "Paid" (green) | "Pending" (yellow) | "You owe" (red)
- Actions: "View Receipt" | "Dispute"

3. ADD EXPENSE MODAL
Trigger: FAB "+" button

Fields:
- Category: Dropdown (Dining, Activities, Transport, Lodging, Shopping)
- Merchant: "Carmen Restaurant"
- Amount: "$180"
- Currency: USD (dropdown)
- Date: Today (date picker)
- Paid by: Dropdown (Alex, Jamie, Sam, Taylor)

Split Options:
- Radio buttons:
  • "Split equally" - $180 ÷ 4 = $45 each
  • "I'll cover this" - $180 charged to you only
  • "Custom split" - Manually assign amounts

If Custom Split:
- Show all members with input fields
- Auto-calculate remaining: "$180 total, $60 assigned, $120 remaining"
- Must total to expense amount

Receipt Upload:
- "📎 Attach Receipt" (optional)
- Tap → Camera or gallery
- Gemini Vision extracts: merchant, amount, date
- Auto-fills form

Primary CTA: "Add Expense"

4. SETTLEMENT SCREEN
Route: /trip/:tripId/settle

Title: "Who Owes Whom"

Settlement Matrix (simplified):
- "Sam owes Alex: $150" (hotel)
  - Breakdown: Hotel share $150
  - CTA: "Request Payment"
- "Jamie owes Taylor: $30" (split dinner)
  - CTA: "Request Payment"

Smart Simplification:
If complex web (A owes B, B owes C, C owes A):
- "💡 I simplified this: Sam pays Alex $120, everyone else is settled."
- Show original (complex) vs. simplified (minimal transactions)

5. PAYMENT REQUEST FLOW
When "Request Payment" tapped:

Modal: "Request $150 from Sam"
Payment Method Options:
- Venmo (if connected)
- PayPal
- Nequi (Colombia)
- Mark as Cash

If Venmo selected:
- Deeplink: Opens Venmo app with pre-filled request
- Request note: "Hotel Poblado Plaza - Bachelor Weekend"
- User returns to app → Can mark "Sent"

Back in app:
- Expense status: "Payment requested" (yellow)
- Sam receives notification: "Alex requested $150 for hotel"
- Sam can: "Pay via Venmo" | "Mark as Paid" | "Dispute"

When Sam pays:
- Status: "Paid ✅" (green)
- Removes from "Who Owes Whom" list

6. PAYMENT INTEGRATION
Connect Payment Apps:
- Settings: /account/connected-apps
- Options: "Connect Venmo" | "Connect PayPal"
- OAuth flow to authorize

Benefits:
- One-tap payment requests
- Auto-detect payments (via Venmo API)
- Sync payment status

7. DISPUTE FLOW
If expense disputed:
- Modal: "Why are you disputing this?"
  • "I already paid"
  • "Amount is wrong"
  • "I wasn't there"
  • "Other" (text input)
- Notifies organizer + person who paid
- Status: "Disputed" (red flag)
- Organizer reviews and resolves

8. STATES
No expenses: "No group expenses yet. Add your first expense to start tracking."
All settled: "Everyone's settled up! 🎉 No one owes anyone."
Pending payments: "2 pending payments totaling $180"

Make expense splitting transparent and drama-free.
```

---

## Database Schema Additions

### group_polls
```sql
CREATE TABLE group_polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  poll_type VARCHAR(20) DEFAULT 'simple',
  
  options JSONB,
  deadline TIMESTAMP,
  
  status VARCHAR(20) DEFAULT 'active',
  winner_option_id INT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES group_polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  vote_data JSONB,
  
  voted_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(poll_id, user_id)
);
```

### group_expenses
```sql
CREATE TABLE group_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  paid_by UUID REFERENCES users(id),
  
  category VARCHAR(50),
  merchant VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  split_type VARCHAR(20) DEFAULT 'equal',
  split_details JSONB,
  
  receipt_url TEXT,
  
  status VARCHAR(20) DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID REFERENCES group_expenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  amount_owed DECIMAL(10,2),
  paid BOOLEAN DEFAULT false,
  payment_method VARCHAR(50),
  paid_at TIMESTAMP
);
```

---

## Real-World Benefits

**For Groups:**
- ✅ 3.2x higher booking value vs. solo trips
- ✅ 3+ hours saved on coordination (vs. WhatsApp chaos)
- ✅ 100% transparency on who owes what
- ✅ Zero post-trip payment drama

**For Platform:**
- ✅ $23 higher average commission per group trip
- ✅ Viral growth (invite friends = new users)
- ✅ Lower cancellation rate (shared commitment)

---

## Production Checklist

- [ ] Group member management (add, remove, roles)
- [ ] Polling system (ranked choice, simple vote)
- [ ] Vote counting algorithm
- [ ] Expense tracking (shared, individual)
- [ ] Split calculation (equal, custom)
- [ ] Payment request integration (Venmo, PayPal)
- [ ] Settlement simplification (minimize transactions)
- [ ] Dispute resolution flow
- [ ] Email notifications for polls and payments
- [ ] Mobile responsive (primary use case)
- [ ] Real-time updates (WebSocket for votes)

---

**Status:** ✅ Specification Complete, Ready for Implementation  
**Estimated Time:** 3 weeks (2 devs)  
**Priority:** High (Phase 1.5 enhancement)
