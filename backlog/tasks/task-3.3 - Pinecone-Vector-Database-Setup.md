---
id: task-3.3
title: Pinecone Vector Database Setup
status: Done
assignee: []
created_date: '2026-01-19 19:42'
updated_date: '2026-01-20 00:51'
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Subtasks

### 3.3.1 Install Pinecone SDK
- `pnpm add @pinecone-database/pinecone`

### 3.3.2 Create Pinecone client
- File: `src/lib/pinecone/client.ts`
- Configure with environment variables
- Export typed client instance

### 3.3.3 Create index setup script
- File: `scripts/setup-pinecone.ts`
- Index name: `shoptalk-contracts`
- Dimension: 3072 (text-embedding-3-large)
- Metric: cosine

### 3.3.4 Define metadata schema
- documentId (string) - for filtering by user's document scope
- article (string)
- section (string)
- pageStart (number)
- pageEnd (number)

### 3.3.5 Build query utility
- File: `src/lib/pinecone/query.ts`
- Search with metadata filtering
- Return top-k results with scores
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Using Mastra PineconeVector with @mastra/pinecone@1.0.0-beta.5. Index: shoptalk-contracts, 3072 dimensions.
<!-- SECTION:NOTES:END -->
