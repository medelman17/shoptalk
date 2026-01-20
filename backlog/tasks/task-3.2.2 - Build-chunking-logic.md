---
id: task-3.2.2
title: Build chunking logic
status: Done
assignee: []
created_date: '2026-01-20 00:09'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - chunking
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.2
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create chunking function that splits documents into semantic chunks.

**File:** `src/lib/documents/chunk.ts`

**Rules:**
- Target 300-500 tokens per chunk
- 50 token overlap between chunks
- Preserve article/section boundaries
- Never break mid-sentence
- Extract metadata (article, section, page range)
<!-- SECTION:DESCRIPTION:END -->
