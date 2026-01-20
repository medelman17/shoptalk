---
id: task-3.2.1
title: Build tokenizer utility
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
Create utility to count tokens in text for chunk sizing.

**Options:**
- Use `tiktoken` (accurate, OpenAI's tokenizer)
- Or simple word-based estimation (faster, less accurate)

**File:** `src/lib/documents/tokenizer.ts`
<!-- SECTION:DESCRIPTION:END -->
