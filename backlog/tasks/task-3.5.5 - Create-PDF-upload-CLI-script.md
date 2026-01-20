---
id: task-3.5.5
title: Create PDF upload CLI script
status: Done
assignee: []
created_date: '2026-01-20 00:09'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - scripts
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build script to upload all PDFs to Vercel Blob and populate database.

**File:** `scripts/upload-pdfs.ts`

**Flow:**
1. Read PDFs from `data/contracts/`
2. Upload each to Vercel Blob
3. Extract page count (using pdf-parse)
4. Insert metadata into Supabase
5. Report upload status
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Deferred - using local file storage
<!-- SECTION:NOTES:END -->
