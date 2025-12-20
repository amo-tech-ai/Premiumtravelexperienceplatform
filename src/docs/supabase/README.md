# Supabase Documentation

**Backend infrastructure and database management documentation.**

---

## 📚 Overview

This folder contains all documentation related to Supabase backend integration, database schema management, and best practices.

---

## 📂 Documents

### 01-declarative-schema-best-practices.md
**Mandatory instructions for database schema management.**

**Contains:**
- Declarative schema workflow
- Migration generation process
- Schema file organization
- Rollback procedures
- Known caveats and limitations
- Compliance requirements

**Why critical:**
- Prevents inconsistent database states
- Ensures reproducible migrations
- Maintains version control of schema
- Enables safe rollbacks

**Who needs this:** All developers working on database changes

---

### 02-postgres-sql-style-guide.md
**SQL coding standards and best practices.**

**Contains:**
- General SQL guidelines
- Naming conventions
- Table and column standards
- Query formatting rules
- Join and CTE best practices
- Complete examples from Trip Operating System

**Why critical:**
- Ensures consistency across codebase
- Improves readability and maintainability
- Reduces errors and confusion
- Makes code reviews easier

**Who needs this:** All developers writing SQL

---

### 03-creating-migrations.md
**Complete guide for creating database migration files.**

**Contains:**
- Migration file naming convention
- SQL guidelines for migrations
- Row Level Security (RLS) requirements
- RLS policy patterns
- Complete migration examples
- Testing procedures
- Common patterns and templates

**Why critical:**
- Ensures secure database schemas
- Provides production-ready migration templates
- Enforces RLS on all tables
- Documents best practices

**Who needs this:** All developers creating database migrations

---

### 04-creating-rls-policies.md
**Expert guide for creating Row Level Security (RLS) policies.**

**Contains:**
- RLS policy syntax and rules
- Operation-specific guidelines (SELECT, INSERT, UPDATE, DELETE)
- Supabase roles (anon vs authenticated)
- Helper functions (auth.uid(), auth.jwt())
- Performance optimization techniques
- PERMISSIVE vs RESTRICTIVE policies
- Complete examples from Trip Operating System
- Testing procedures

**Why critical:**
- Ensures database security
- Prevents unauthorized access
- Optimizes query performance
- Provides battle-tested patterns

**Who needs this:** All developers creating RLS policies

---

### 05-creating-functions.md
**Expert guide for creating PostgreSQL database functions.**

**Contains:**
- Function security (SECURITY INVOKER vs DEFINER)
- Search path configuration (always empty)
- Function volatility (IMMUTABLE, STABLE, VOLATILE)
- Best practices (minimize side effects, explicit typing)
- Trigger functions
- Error handling
- Performance optimization
- Complete Trip Operating System examples
- Testing procedures

**Why critical:**
- Ensures secure function execution
- Optimizes query performance
- Provides reusable database logic
- Documents best practices

**Who needs this:** All developers creating database functions

---

### 06-creating-edge-functions.md
**Expert guide for creating Supabase Edge Functions with TypeScript and Deno.**

**Contains:**
- Deno runtime best practices
- Import specifiers (npm:, jsr:, node:)
- Shared utilities via _shared directory
- Environment variables and secrets
- Multiple routes with Hono/Express
- Background tasks with waitUntil
- CORS handling
- Error handling patterns
- Complete Trip Operating System examples
- Testing and deployment procedures

**Why critical:**
- Enables serverless API endpoints
- Provides secure backend logic
- Optimizes cold start performance
- Documents production patterns

**Who needs this:** All developers creating Edge Functions

---

### schema/ — Complete Database Schema Design
**Production-ready schema staged for incremental implementation**

**Directory Structure:**
```
schema/
├── 00-index.md                    # Overview and implementation guide
├── 01-core-schema.md              # Stage 1: Core tables (MVP)
├── 02-advanced-schema.md          # Stage 2: Advanced features
├── 03-ai-agents-schema.md         # Stage 3: AI intelligence
├── 04-payments-stripe-schema.md   # Stage 4: Monetization
├── 05-whatsapp-automation-schema.md # Stage 5: Messaging
└── diagrams/
    ├── erd-core.mmd
    ├── erd-advanced.mmd
    ├── erd-ai.mmd
    ├── erd-payments.mmd
    └── erd-whatsapp.mmd
```

**Contains:**
- 5 incremental implementation stages
- 30+ production-ready tables
- Complete RLS policies
- Edge Function templates
- Mermaid ERD diagrams
- Migration workflows
- Testing procedures

**Why critical:**
- Complete backend architecture
- Staged implementation plan
- Production-ready from day 1
- Clear dependencies

**Who needs this:** All backend developers, architects

---

## 🎯 Quick Start

### First Time Setup

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase project:**
   ```bash
   supabase init
   ```

3. **Start local environment:**
   ```bash
   supabase start
   ```

4. **Link to remote project** (if exists):
   ```bash
   supabase link --project-ref <project-id>
   ```

---

## 🔄 Standard Workflow

### Making Schema Changes

```mermaid
flowchart LR
    A[Stop Supabase] --> B[Edit schema .sql]
    B --> C[Generate migration]
    C --> D[Review migration]
    D --> E[Test locally]
    E --> F[Commit]
    F --> G[Push to remote]
```

**Detailed steps:**

1. **Stop local environment:**
   ```bash
   supabase stop
   ```

2. **Edit schema file:**
   ```bash
   # Edit or create file in supabase/schemas/
   vim supabase/schemas/users.sql
   ```

3. **Generate migration:**
   ```bash
   supabase db diff -f add_users_table
   ```

4. **Review generated migration:**
   ```bash
   cat supabase/migrations/TIMESTAMP_add_users_table.sql
   ```

5. **Start and test:**
   ```bash
   supabase start
   # Test your changes
   ```

6. **Commit both files:**
   ```bash
   git add supabase/schemas/users.sql
   git add supabase/migrations/TIMESTAMP_add_users_table.sql
   git commit -m "Add users table"
   ```

---

## 📁 Directory Structure

```
supabase/
├── schemas/              # Declarative schema files (edit these)
│   ├── users.sql
│   ├── trips.sql
│   ├── places.sql
│   └── ...
├── migrations/           # Generated migrations (don't edit)
│   ├── 20241220_init.sql
│   ├── 20241221_add_users.sql
│   └── ...
├── functions/           # Edge functions
│   └── ...
└── config.toml          # Supabase config
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This

```bash
# DON'T edit migrations directly
vim supabase/migrations/20241220_init.sql

# DON'T generate migrations with Supabase running
supabase start
supabase db diff -f my_migration  # ❌ Wrong!
```

### ✅ Do This Instead

```bash
# DO edit schema files
vim supabase/schemas/users.sql

# DO stop before generating migrations
supabase stop
supabase db diff -f my_migration  # ✅ Correct!
```

---

## 🔍 Debugging Tips

### Check Current Schema

```bash
# View all tables
supabase db list

# Dump current schema
supabase db dump -f current_schema.sql
```

### Reset Local Database

```bash
# Warning: This deletes all local data
supabase db reset
```

### View Migration Status

```bash
# Check which migrations have been applied
supabase migration list
```

---

## 📊 Schema Organization Best Practices

### Naming Conventions

```
supabase/schemas/
├── 01-tables-users.sql           # Core tables first
├── 02-tables-trips.sql
├── 03-tables-places.sql
├── 10-views-trip-stats.sql       # Views after tables
├── 20-functions-search.sql       # Functions last
└── 30-policies-rls.sql           # Policies last
```

**Why numbered?**
- Ensures correct execution order
- Makes dependencies clear
- Easy to add new files in correct order

### File Content Template

```sql
-- File: supabase/schemas/users.sql
-- Purpose: User accounts and authentication
-- Dependencies: None

-- Drop existing (idempotent)
DROP TABLE IF EXISTS users CASCADE;

-- Create table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Comments
COMMENT ON TABLE users IS 'User accounts';
COMMENT ON COLUMN users.email IS 'User email address';
```

---

## 🔐 Security Considerations

### Row Level Security (RLS)

**Always enable RLS for user data:**

```sql
-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own trips
CREATE POLICY "Users view own trips"
  ON trips
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only modify their own trips
CREATE POLICY "Users modify own trips"
  ON trips
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### Sensitive Data

**Never store in plain text:**
- Passwords (use Supabase Auth)
- API keys (use Vault)
- Credit cards (use Stripe)
- Personal identifiable information (encrypt if needed)

---

## 🧪 Testing

### Local Testing

```bash
# Start fresh
supabase db reset

# Apply migrations
supabase db push

# Seed test data
psql postgresql://postgres:postgres@localhost:54322/postgres < test/seed.sql

# Run tests
npm run test:db
```

### CI/CD Testing

```yaml
# .github/workflows/test.yml
- name: Setup Supabase
  run: |
    supabase init
    supabase start
    supabase db push

- name: Run tests
  run: npm run test:db
```

---

## 🚀 Deployment

### To Staging

```bash
# Link to staging project
supabase link --project-ref staging-project-id

# Push migrations
supabase db push

# Verify
supabase db remote ls
```

### To Production

```bash
# Link to production project
supabase link --project-ref prod-project-id

# Dry run first
supabase db push --dry-run

# Review changes carefully
# Then push for real
supabase db push

# Verify
supabase db remote ls
```

---

## 📚 Additional Resources

### Official Documentation
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Schema Diff Tool](https://supabase.com/docs/guides/cli/managing-config#schema-diff)

### Internal Documentation
- [Architecture → ERD](/docs/architecture/02-entity-relationship-diagram.md)
- [Production → Backend Integration](/docs/features/04-backend-integration-supabase.md)
- [Architecture → Data Flow](/docs/architecture/03-data-flow-diagram.md)

---

## 🆘 Getting Help

### Common Issues

1. **"Connection refused"**
   - Solution: Run `supabase start`

2. **"Migration failed"**
   - Solution: Check migration file for syntax errors
   - Run `supabase db reset` and try again

3. **"Schema diff shows unexpected changes"**
   - Solution: Ensure Supabase is stopped before generating diff
   - Check schema files match database state

### Support Channels

- **Internal:** #backend-support Slack channel
- **Supabase:** [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- **Emergency:** Database team on-call

---

**Last Updated:** December 20, 2024  
**Maintained by:** Backend Team  
**Status:** Living document - updated as practices evolve