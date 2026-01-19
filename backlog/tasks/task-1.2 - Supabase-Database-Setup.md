---
id: task-1.2
title: Supabase Database Setup
status: Done
assignee: []
created_date: '2026-01-19 19:41'
updated_date: '2026-01-19 20:51'
labels:
  - P0
  - database
  - phase-1
milestone: 'Phase 1: Foundation (Weeks 1-2)'
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create Supabase project and configure database schema for user profiles and queries.

## Implementation Steps
1. Create Supabase project
2. Design user schema:
   - UserProfile table (clerk_id, local_number, classification, etc.)
   - Query table (user_id, question, answer, citations, timestamp)
3. Configure Row Level Security (RLS) policies
4. Setup Clerk webhook to sync users on first auth
5. Create database types for TypeScript

## Schema Design
```sql
-- UserProfile
- id: uuid (PK)
- clerk_id: text (unique, indexed)
- local_number: integer
- classification: text
- supplement_ids: text[] (derived from local)
- created_at: timestamp
- updated_at: timestamp

-- Query
- id: uuid (PK)
- user_id: uuid (FK to UserProfile)
- question: text
- answer: text
- citations: jsonb
- created_at: timestamp
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Supabase project created with correct region
- [x] #2 UserProfile table created with all required columns
- [x] #3 Query table created with foreign key relationship
- [x] #4 RLS policies restrict users to their own data
- [x] #5 Clerk webhook endpoint syncs new users to database
- [x] #6 TypeScript types generated from database schema
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Completed 2026-01-19: Installed @supabase/supabase-js, @supabase/ssr, svix. Created Supabase clients (client.ts, server.ts, admin.ts), TypeScript types, Clerk webhook handler, data access layer (user-profile.ts, queries.ts). Set up Supabase CLI migrations, created initial schema with user_profiles and queries tables, deployed to remote database.
<!-- SECTION:NOTES:END -->
