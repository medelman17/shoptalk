---
id: task-3.4.2
title: Create embed and ingest CLI script
status: Done
assignee: []
created_date: '2026-01-20 00:09'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - scripts
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build script to embed chunks and upsert to Pinecone.

**File:** `scripts/embed-and-ingest.ts`

**Flow:**
1. Read chunks from `data/chunks/`
2. Generate embeddings in batches
3. Upsert to Pinecone with metadata
4. Report progress and statistics
<!-- SECTION:DESCRIPTION:END -->
