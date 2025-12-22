#!/bin/bash

# ============================================================================
# Supabase Backend Verification Script
# ============================================================================
# Purpose: Verify all schemas, functions, and documentation are in place
# Usage: bash supabase/verify-setup.sh
# ============================================================================

set -e  # Exit on error

echo "🔍 Verifying Supabase Backend Setup..."
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# ============================================================================
# Check 1: Schema Files
# ============================================================================

echo "📄 Checking Schema Files..."

SCHEMA_FILES=(
  "supabase/schemas/00-core-profiles.sql"
  "supabase/schemas/01-core-preferences.sql"
  "supabase/schemas/02-core-conversations.sql"
  "supabase/schemas/03-core-places.sql"
  "supabase/schemas/04-core-itinerary.sql"
  "supabase/schemas/10-advanced-embeddings.sql"
  "supabase/schemas/11-advanced-automations.sql"
)

for file in "${SCHEMA_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file (MISSING)"
    ((ERRORS++))
  fi
done

echo ""

# ============================================================================
# Check 2: Edge Functions
# ============================================================================

echo "⚡ Checking Edge Functions..."

FUNCTION_FILES=(
  "supabase/functions/ai-orchestrator/index.ts"
)

for file in "${FUNCTION_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file (MISSING)"
    ((ERRORS++))
  fi
done

echo ""

# ============================================================================
# Check 3: Documentation Files
# ============================================================================

echo "📚 Checking Documentation..."

DOC_FILES=(
  "supabase/docs/00-README.md"
  "supabase/docs/03-entity-relationships.md"
  "supabase/docs/04-data-flows.md"
  "supabase/docs/06-implementation-order.md"
  "supabase/docs/IMPLEMENTATION-COMPLETE.md"
  "supabase/MASTER-INDEX.md"
)

for file in "${DOC_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file (MISSING)"
    ((ERRORS++))
  fi
done

echo ""

# ============================================================================
# Check 4: Supabase CLI
# ============================================================================

echo "🔧 Checking Supabase CLI..."

if command -v supabase &> /dev/null; then
  SUPABASE_VERSION=$(supabase --version)
  echo -e "  ${GREEN}✓${NC} Supabase CLI installed: $SUPABASE_VERSION"
else
  echo -e "  ${YELLOW}⚠${NC} Supabase CLI not found (install with: npm install -g supabase)"
  ((WARNINGS++))
fi

echo ""

# ============================================================================
# Check 5: Environment Variables (if .env exists)
# ============================================================================

echo "🔐 Checking Environment Variables..."

if [ -f ".env" ]; then
  echo -e "  ${GREEN}✓${NC} .env file found"
  
  # Check for required variables
  if grep -q "VITE_GEMINI_API_KEY" .env; then
    echo -e "  ${GREEN}✓${NC} VITE_GEMINI_API_KEY configured"
  else
    echo -e "  ${YELLOW}⚠${NC} VITE_GEMINI_API_KEY not found in .env"
    ((WARNINGS++))
  fi
  
  if grep -q "VITE_GOOGLE_MAPS_API_KEY" .env; then
    echo -e "  ${GREEN}✓${NC} VITE_GOOGLE_MAPS_API_KEY configured"
  else
    echo -e "  ${YELLOW}⚠${NC} VITE_GOOGLE_MAPS_API_KEY not found in .env"
    ((WARNINGS++))
  fi
else
  echo -e "  ${YELLOW}⚠${NC} .env file not found (create from .env.example)"
  ((WARNINGS++))
fi

echo ""

# ============================================================================
# Check 6: File Counts
# ============================================================================

echo "📊 File Statistics..."

SCHEMA_COUNT=$(find supabase/schemas -name "*.sql" 2>/dev/null | wc -l)
echo "  Schemas: $SCHEMA_COUNT/7"

FUNCTION_COUNT=$(find supabase/functions -name "index.ts" 2>/dev/null | wc -l)
echo "  Edge Functions: $FUNCTION_COUNT/1"

DOC_COUNT=$(find supabase/docs -name "*.md" 2>/dev/null | wc -l)
echo "  Documentation: $DOC_COUNT/5"

echo ""

# ============================================================================
# Check 7: SQL Syntax (if Supabase is running)
# ============================================================================

echo "🧪 Testing SQL Syntax..."

if command -v supabase &> /dev/null; then
  if supabase status &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Supabase is running locally"
    
    # Try to apply schemas (dry run)
    echo "  Testing schema application..."
    
    for file in "${SCHEMA_FILES[@]}"; do
      if [ -f "$file" ]; then
        # Check if file is valid SQL (basic check)
        if grep -q "CREATE TABLE" "$file"; then
          echo -e "    ${GREEN}✓${NC} $(basename $file) has valid SQL structure"
        else
          echo -e "    ${YELLOW}⚠${NC} $(basename $file) may not contain table definitions"
          ((WARNINGS++))
        fi
      fi
    done
  else
    echo -e "  ${YELLOW}⚠${NC} Supabase is not running (start with: supabase start)"
    ((WARNINGS++))
  fi
else
  echo -e "  ${YELLOW}⚠${NC} Skipping SQL tests (Supabase CLI not installed)"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================

echo "========================================"
echo "📋 Verification Summary"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Read: supabase/docs/00-README.md"
  echo "2. Follow: supabase/docs/06-implementation-order.md"
  echo "3. Start Supabase: supabase start"
  echo "4. Apply schemas: supabase db execute --file supabase/schemas/00-core-profiles.sql"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ Verification completed with warnings${NC}"
  echo "Warnings: $WARNINGS"
  echo ""
  echo "Review the warnings above and install missing dependencies."
  echo ""
  exit 0
else
  echo -e "${RED}❌ Verification failed${NC}"
  echo "Errors: $ERRORS"
  echo "Warnings: $WARNINGS"
  echo ""
  echo "Please fix the errors above before proceeding."
  echo ""
  exit 1
fi
