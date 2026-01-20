---
id: task-3.1.4
title: Create PDF extraction CLI script
status: Done
assignee: []
created_date: '2026-01-20 00:08'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - scripts
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build CLI script for batch PDF extraction.

**File:** `scripts/extract-pdf.ts`

**Features:**
- Accept single PDF path or directory for batch mode
- Output structured JSON to `data/extracted/<doc-id>.json`
- Progress logging
- Error handling for malformed PDFs
<!-- SECTION:DESCRIPTION:END -->
