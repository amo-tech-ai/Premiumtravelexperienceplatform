#!/bin/bash

# ============================================================================
# Trip Creation Flow Regression Check
# ============================================================================
#
# Purpose: Prevent regressions where "New Trip" button bypasses the modal
# Context: TripCreateModal fix - button must call openCreateTrip(), not createTrip() API
#
# This script verifies:
# 1. TripsPage does NOT directly call createTrip() API
# 2. TripsPage DOES use useWizard hook
# 3. TripsPage button DOES call openCreateTrip()
# 4. No `any` types in trip creation components
# 5. No unguarded console.log in production code
#
# Usage:
#   ./scripts/verify-trip-creation.sh
#   
# Exit codes:
#   0 = All checks passed
#   1 = Regression detected
# ============================================================================

set -e

FAILED=0
CHECKS_PASSED=0
CHECKS_TOTAL=5

echo "🔍 Trip Creation Flow - Regression Check"
echo "=========================================="
echo ""

# ============================================================================
# CHECK 1: TripsPage must NOT directly call createTrip() API
# ============================================================================
echo "✓ Check 1: TripsPage must NOT directly call createTrip() API"

if grep -q "const.*createTrip.*=.*useTrips" pages/app/TripsPage.tsx; then
  echo "  ❌ FAIL: TripsPage is importing createTrip from useTrips hook"
  echo "  → This bypasses the modal system"
  echo "  → Button should call openCreateTrip() from WizardContext instead"
  echo ""
  FAILED=1
elif grep -q "await createTrip(" pages/app/TripsPage.tsx; then
  echo "  ❌ FAIL: TripsPage is directly calling createTrip()"
  echo "  → This bypasses the modal system"
  echo "  → Button should call openCreateTrip() from WizardContext instead"
  echo ""
  FAILED=1
else
  echo "  ✅ PASS: TripsPage does not directly call createTrip"
  echo ""
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# ============================================================================
# CHECK 2: TripsPage MUST use useWizard hook
# ============================================================================
echo "✓ Check 2: TripsPage MUST use useWizard hook"

if grep -q "useWizard" pages/app/TripsPage.tsx; then
  echo "  ✅ PASS: TripsPage imports and uses useWizard hook"
  echo ""
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  echo "  ❌ FAIL: TripsPage does not use useWizard hook"
  echo "  → Modal cannot be opened without WizardContext"
  echo ""
  FAILED=1
fi

# ============================================================================
# CHECK 3: TripsPage MUST call openCreateTrip()
# ============================================================================
echo "✓ Check 3: TripsPage MUST call openCreateTrip()"

if grep -q "openCreateTrip" pages/app/TripsPage.tsx; then
  echo "  ✅ PASS: TripsPage calls openCreateTrip()"
  echo ""
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  echo "  ❌ FAIL: TripsPage does not call openCreateTrip()"
  echo "  → Button will not open the modal"
  echo ""
  FAILED=1
fi

# ============================================================================
# CHECK 4: No `any` types in trip creation components
# ============================================================================
echo "✓ Check 4: No 'any' types in trip creation components"

ANY_COUNT=$(grep -c ": any" components/trip-wizard/TripCreateModal.tsx || echo "0")

if [ "$ANY_COUNT" -eq 0 ]; then
  echo "  ✅ PASS: No 'any' types found in TripCreateModal"
  echo ""
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  echo "  ❌ FAIL: Found $ANY_COUNT instances of 'any' type in TripCreateModal"
  echo "  → Replace with proper types from src/types/trips.ts"
  grep -n ": any" components/trip-wizard/TripCreateModal.tsx | head -5
  echo ""
  FAILED=1
fi

# ============================================================================
# CHECK 5: No unguarded console.log in production code
# ============================================================================
echo "✓ Check 5: No unguarded console.log in production code"

# Check for console.log that's NOT wrapped in dev check
UNGUARDED_LOGS=$(grep "console.log" components/trip-wizard/TripCreateModal.tsx | grep -v "import.meta.env.DEV" || echo "")

if [ -z "$UNGUARDED_LOGS" ]; then
  echo "  ✅ PASS: No unguarded console.log statements"
  echo ""
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
  echo "  ❌ FAIL: Found unguarded console.log statements"
  echo "  → Wrap in: if (import.meta.env.DEV) console.log(...)"
  echo "$UNGUARDED_LOGS"
  echo ""
  FAILED=1
fi

# ============================================================================
# SUMMARY
# ============================================================================
echo "=========================================="
echo "Results: $CHECKS_PASSED/$CHECKS_TOTAL checks passed"
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ REGRESSION DETECTED"
  echo ""
  echo "Trip creation flow has regressed to broken state."
  echo "See errors above for details."
  echo ""
  echo "Reference: /docs/05-tripcreatemodal-fix-diagrams.md"
  echo ""
  exit 1
else
  echo "✅ ALL CHECKS PASSED"
  echo ""
  echo "Trip creation flow is correctly implemented:"
  echo "  • Button opens modal via WizardContext"
  echo "  • No direct API calls from TripsPage"
  echo "  • Proper TypeScript types"
  echo "  • No console pollution"
  echo ""
  exit 0
fi
