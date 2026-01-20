---
id: task-3.5.2
title: Create documents table migration
status: Done
assignee: []
created_date: '2026-01-20 00:09'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - database
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create Supabase migration for documents metadata table.

**File:** `supabase/migrations/xxx_create_documents_table.sql`

**Columns:**
- `id` (TEXT PRIMARY KEY) - e.g., "master", "western"
- `title` (TEXT) - Full document title
- `short_title` (TEXT) - Display name
- `type` (TEXT) - master/supplement/rider/local
- `blob_url` (TEXT) - Vercel Blob URL
- `page_count` (INTEGER)
- `effective_date` (DATE)
- `expiration_date` (DATE)
- `created_at` (TIMESTAMPTZ)
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Deferred - using document manifest instead
<!-- SECTION:NOTES:END -->
