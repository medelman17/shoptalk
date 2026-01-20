---
id: task-3.3.3
title: Create Pinecone index setup script
status: Done
assignee: []
created_date: '2026-01-20 00:09'
updated_date: '2026-01-20 00:51'
labels:
  - phase-3
  - scripts
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3.3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build script to create and configure Pinecone index.

**File:** `scripts/setup-pinecone.ts`

**Configuration:**
- Index name: `shoptalk-contracts`
- Dimension: 3072 (text-embedding-3-large)
- Metric: cosine
- Serverless spec
<!-- SECTION:DESCRIPTION:END -->
