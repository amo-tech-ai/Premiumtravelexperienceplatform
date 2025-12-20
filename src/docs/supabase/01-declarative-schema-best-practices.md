# Supabase Declarative Schema Management — Best Practices

**Date:** December 20, 2024  
**Purpose:** Mandatory instructions for database schema management  
**Compliance:** Required for all database modifications

---

## 🎯 Overview

This document outlines the **mandatory** best practices for managing database schemas in the Trip Operating System using Supabase's declarative schema approach.

**Key Principle:** All database schema changes must be declared in `.sql` files and migrations generated automatically via CLI.

---

## Mandatory Instructions for Supabase Declarative Schema Management

### 1. **Exclusive Use of Declarative Schema**

- **All database schema modifications must be defined within `.sql` files located in the `supabase/schemas/` directory.**
- **Do not** create or modify files directly in the `supabase/migrations/` directory unless the modification is about the known caveats below. Migration files are to be generated automatically through the CLI.

---

### 2. **Schema Declaration**

- For each database entity (e.g., tables, views, functions), create or update a corresponding `.sql` file in the `supabase/schemas/` directory
- Ensure that each `.sql` file accurately represents the desired final state of the entity

---

### 3. **Migration Generation**

- Before generating migrations, **stop the local Supabase development environment**
  ```bash
  supabase stop
  ```
  
- Generate migration files by diffing the declared schema against the current database state
  ```bash
  supabase db diff -f <migration_name>
  ```
  Replace `<migration_name>` with a descriptive name for the migration

---

### 4. **Schema File Organization**

- Schema files are executed in lexicographic order. To manage dependencies (e.g., foreign keys), name files to ensure correct execution order
- When adding new columns, append them to the end of the table definition to prevent unnecessary diffs

---

### 5. **Rollback Procedures**

- To revert changes:
  - Manually update the relevant `.sql` files in `supabase/schemas/` to reflect the desired state
  - Generate a new migration file capturing the rollback
    ```bash
    supabase db diff -f <rollback_migration_name>
    ```
  - Review the generated migration file carefully to avoid unintentional data loss

---

### 6. **Known Caveats**

The migra diff tool used for generating schema diff is capable of tracking most database changes. However, there are edge cases where it can fail.

If you need to use any of the entities below, remember to add them through versioned migrations instead.

#### Data Manipulation Language

- DML statements such as insert, update, delete, etc., are not captured by schema diff

#### View Ownership

- view owner and grants
- security invoker on views
- materialized views
- doesn't recreate views when altering column type

#### RLS Policies

- alter policy statements
- column privileges

#### Other Entities

- schema privileges are not tracked because each schema is diffed separately
- comments are not tracked
- partitions are not tracked
- alter publication ... add table ...
- create domain statements are ignored
- grant statements are duplicated from default privileges

---

## 🚫 Compliance Warning

**Non-compliance with these instructions may lead to inconsistent database states and is strictly prohibited.**

---

## 📋 Quick Reference Checklist

### Before Making Schema Changes

- [ ] Stop local Supabase environment (`supabase stop`)
- [ ] Update or create `.sql` file in `supabase/schemas/`
- [ ] Ensure file represents desired final state
- [ ] Consider file naming for execution order

### Generating Migration

- [ ] Run `supabase db diff -f <migration_name>`
- [ ] Review generated migration file
- [ ] Test migration locally
- [ ] Commit both schema file and migration

### Rollback

- [ ] Update schema `.sql` file to previous state
- [ ] Generate rollback migration
- [ ] Review for data loss risks
- [ ] Test rollback locally

---

## 🔗 Related Documentation

- **[Architecture → ERD](/docs/architecture/02-entity-relationship-diagram.md)** - Complete database schema
- **[Architecture → System Architecture](/docs/architecture/01-system-architecture.md)** - Data layer architecture
- **[Production → Backend Integration](/docs/features/04-backend-integration-supabase.md)** - Supabase setup guide

---

**Status:** Mandatory compliance required  
**Last Updated:** December 20, 2024  
**Maintained by:** Database Team
