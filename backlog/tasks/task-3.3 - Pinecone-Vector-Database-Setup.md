---
id: task-3.3
title: Pinecone Vector Database Setup
status: To Do
assignee: []
created_date: '2026-01-19 19:42'
labels:
  - P0
  - documents
  - vector-db
  - phase-3
milestone: 'Phase 3: Documents (Weeks 3-4)'
dependencies: []
parent_task_id: task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Configure Pinecone index for storing and querying document embeddings.

## Implementation Steps
1. Create Pinecone account and project
2. Create index with configuration:
   - Dimension: 3072 (text-embedding-3-large)
   - Metric: cosine similarity
   - Pod type: based on scale needs
3. Define metadata schema for filtering:
   - documentId (for scope filtering)
   - article, section, page (for citations)
4. Build upsert function for ingestion
5. Build query function with metadata filtering
6. Test query accuracy with sample questions

## Metadata Schema
```typescript
{
  documentId: string;    // "master-agreement", "western-supplement"
  article: string;       // "Article 6"
  section: string;       // "Section 2(a)"
  pageStart: number;
  pageEnd: number;
  chunkIndex: number;
}
```

## Query Pattern
Filter by user's document scope, then vector search within filtered results.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Pinecone index created with correct dimensions
- [ ] #2 Metadata schema supports document filtering
- [ ] #3 Upsert function successfully stores vectors
- [ ] #4 Query function returns relevant results
- [ ] #5 Metadata filtering by documentId works correctly
<!-- AC:END -->
