---
id: task-3.1.3
title: Build PDF extraction utility
status: Done
assignee: []
created_date: '2026-01-20 00:08'
updated_date: '2026-01-20 00:50'
labels:
  - phase-3
  - extraction
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create extraction function that pulls text from PDFs with page boundaries.

**File:** `src/lib/documents/extract.ts`

**Features:**
- Extract all text preserving page numbers
- Regex patterns to identify Article/Section headers
- Handle various PDF formatting styles
- Return structured ExtractedDocument
<!-- SECTION:DESCRIPTION:END -->
