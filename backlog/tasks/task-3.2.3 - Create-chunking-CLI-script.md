---
id: task-3.2.3
title: Create chunking CLI script
status: Done
assignee: []
created_date: '2026-01-20 00:09'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - scripts
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.2
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build CLI script for batch document chunking.

**File:** `scripts/chunk-documents.ts`

**Features:**
- Read extracted JSON from `data/extracted/`
- Apply chunking logic
- Output to `data/chunks/<doc-id>.json`
- Report statistics (chunk count, avg size)
<!-- SECTION:DESCRIPTION:END -->
