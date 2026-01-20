---
id: task-3.5.4
title: Create document metadata CRUD
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
Build data access layer for documents table.

**File:** `src/lib/db/documents.ts`

**Functions:**
- `getDocument(id)` - Get single document
- `getDocuments(ids)` - Get multiple by IDs
- `getDocumentsByType(type)` - Filter by type
- `upsertDocument(doc)` - Insert or update
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented in src/lib/documents/manifest.ts
<!-- SECTION:NOTES:END -->
